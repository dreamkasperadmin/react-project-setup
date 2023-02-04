import { ApolloProvider } from '@apollo/client';
import * as Sentry from '@sentry/react';
import { Button, message } from 'antd';
import React from 'react';
import ReactDOM from 'react-dom';
import client from './apollo';
import { AppContextProvider } from './AppContext';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Routes from './Routes';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import './styles/main.less';

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: process.env.REACT_APP_ENV,
  tracesSampleRate: 1.0
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <AppContextProvider>
      <Routes />
    </AppContextProvider>
  </ApolloProvider>,
  // eslint-disable-next-line no-undef
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
// serviceWorkerRegistration.unregister();
serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    if (registration && registration.waiting) {
      // eslint-disable-next-line no-console
      console.log('Inside registration');
      message.info({
        content: (
          <>
            New version available! Click Reload to get the latest version.
            <Button
              className="ml-1 mb-0"
              type="link"
              onClick={() => {
                // eslint-disable-next-line no-unused-expressions
                registration &&
                  registration.waiting &&
                  registration.waiting.postMessage &&
                  registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                // eslint-disable-next-line no-undef
                window.location.reload();
              }}
            >
              Reload
            </Button>
          </>
        ),
        duration: 0
      });
    }
  }
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
