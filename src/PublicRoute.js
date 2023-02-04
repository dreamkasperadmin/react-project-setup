import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { AppContext } from './AppContext';
import { ROUTES } from './common/constants';

function PublicRoute({ component: Component, ...rest }) {
  const { getToken } = useContext(AppContext);
  const idToken = getToken();

  return (
    <Route
      {...rest}
      render={(props) =>
        idToken ? <Redirect to={ROUTES?.MAIN} /> : <Component {...props} />
      }
    />
  );
}

export default PublicRoute;