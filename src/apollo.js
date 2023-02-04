/* eslint-disable no-console */
/* eslint-disable no-loop-func */
/* eslint-disable no-restricted-syntax */
import {
  ApolloLink,
  createHttpLink,
  from,
  fromPromise,
  split
} from '@apollo/client';
import { InMemoryCache } from '@apollo/client/cache';
import { ApolloClient } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import * as Sentry from '@sentry/browser';
import { message } from 'antd';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { get, isObject } from 'lodash';
import { TOKEN } from './common/constants';
import history from './historyData';

let disableToastTimeout = null;
export const cacheData = new InMemoryCache();
// eslint-disable-next-line no-undef
const token = localStorage.getItem(TOKEN);

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_SERVER_URL
});

const wsLink = new WebSocketLink({
  uri: process.env.REACT_APP_WSS_SERVER_URL,
  options: {
    reconnect: true,
    connectionParams: {
      authorization: `Bearer ${token}`
    }
  }
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

export const toast = ({ message: content, type }) => {
  message.destroy();
  switch (type) {
    case 'info':
      message.info(content);
      break;
    case 'success':
      message.success(content);
      break;
    case 'warning':
      message.warning(content);
      break;
    case 'error':
      message.error(content);
      break;
    default:
      break;
  }
};

const authLink = setContext((ctx, { headers }) => {
  // eslint-disable-next-line no-undef
  const userToken = localStorage.getItem(TOKEN);
  let newHeaders = headers || {};

  newHeaders = {
    ...newHeaders,
    authorization: userToken ? `Bearer ${userToken}` : ''
  };

  return {
    headers: newHeaders
  };
});

const responseMessageLink = new ApolloLink((operation, forward) => {
  return forward(operation).map((response) => {
    const { data } = response;

    if (
      data &&
      isObject(data) &&
      Object.keys(data).length > 0 &&
      data[`${Object.keys(data)[0]}`] &&
      data[`${Object.keys(data)[0]}`].message
    ) {
      if (Object.keys(data)[0] === 'forgotUserPassword') {
        if (data[`${Object.keys(data)[0]}`].status !== 'ERROR') {
          setTimeout(() => {
            toast({
              message:
                data[`${Object.keys(data)[0]}`].message ||
                'Operation successful',
              type: 'success'
            });
          }, 1000);
        }
      } else {
        setTimeout(() => {
          const oResponse = data[`${Object.keys(data)[0]}`];

          if (!response) {
            return;
          }

          toast({
            message: oResponse.message || 'Operation successful',
            type: oResponse.status === 'ERROR' ? 'error' : 'success'
          });
        }, 1000);
      }
    }
    return response;
  });
});

const errorLink = onError((options) => {
  const { graphQLErrors, networkError, response, operation, forward } = options;
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      switch (err?.extensions?.code) {
        case 'UNAUTHENTICATED':
          if (err?.message.includes('Token has expired')) {
            return fromPromise(
              firebase
                ?.auth()
                ?.currentUser?.getIdToken(true)
                ?.catch(() => {
                  history.replace('/logout');
                })
            )
              .filter((value) => Boolean(value))
              .flatMap((accessToken) => {
                const oldHeaders = operation?.getContext().headers;
                operation.setContext({
                  headers: {
                    ...oldHeaders,
                    authorization: `Bearer ${accessToken}`
                  }
                });
                // eslint-disable-next-line
                localStorage.setItem(TOKEN, accessToken);

                // retry the request, returning the new observable
                return forward(operation);
              });
          }

          toast({
            message: err?.message || 'Something went wrong',
            type: 'error'
          });
          break;
        default:
      }
    }
    return;
  }

  if (networkError && networkError?.statusCode === 405) {
    if (disableToastTimeout) {
      clearTimeout(disableToastTimeout);
    }

    disableToastTimeout = setTimeout(() => {
      if (networkError?.result && networkError?.result?.message) {
        toast({
          message: networkError.result.message,
          type: 'error'
        });
      }
    }, 200);

    history.replace('/logout');
    return;
  }

  if (graphQLErrors && graphQLErrors.length > 0) {
    const isForBidden =
      get(graphQLErrors[0], 'extensions.code') === 'FORBIDDEN';

    if (!isForBidden) {
      setTimeout(() => {
        toast({
          message: graphQLErrors[0].message,
          type: 'error'
        });
      }, 1000);
    }
  } else {
    if (networkError.message.includes('Token has expired')) {
      return fromPromise(
        firebase
          ?.auth()
          ?.currentUser?.getIdToken(true)
          ?.catch(() => {
            history.replace('/logout');
          })
      )
        .filter((value) => Boolean(value))
        .flatMap((accessToken) => {
          const oldHeaders = operation.getContext().headers;
          operation.setContext({
            headers: {
              ...oldHeaders,
              authorization: `Bearer ${accessToken}`
            }
          });
          // eslint-disable-next-line
          localStorage.setItem(TOKEN, accessToken);

          // retry the request, returning the new observable
          return forward(operation);
        });
    }
    setTimeout(() => {
      toast({
        message: 'Something went wrong!',
        type: 'error'
      });
    }, 1000);
  }

  if (response) {
    response.errors.map((error) => {
      const { message: errorMessage, locations, path, extensions } = error;

      // Enable when sentry integrated
      Sentry.captureException(
        new Error(
          `[Response error]: Message: ${errorMessage}, Location: ${locations}, Path: ${path}`
        )
      );

      if (extensions && extensions.code === 'FORBIDDEN') {
        history.replace('/access-denied');
      }

      if (
        extensions &&
        (extensions.code === 'UNAUTHENTICATED' ||
          extensions.code === 405 ||
          extensions.exception.name === 'JsonWebTokenError')
      ) {
        history.replace('/logout');
      }

      // eslint-disable-next-line no-console
      return console.log(
        `[Response error]: Message: ${errorMessage}, Location: ${locations}, Path: ${path}`
      );
    });
  }

  if (networkError) {
    // eslint-disable-next-line no-console
    console.log(`[Network error]: ${networkError}`);
    Sentry.captureException(new Error(`[Network error]: ${networkError}`));
  }
});

const client = new ApolloClient({
  cache: cacheData,
  link: from([responseMessageLink, errorLink, authLink, splitLink])
});

export default client;
