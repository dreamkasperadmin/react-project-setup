import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ROUTES } from '../common/constants';
import Error404 from '../Error404';
import DashboardWrapper from '../modules/Dashboard';
import UserWrapper from '../modules/users';

const ContentRoutes = () => {
  return (
    <>
      <Switch>
        <Route path={ROUTES?.USERS_MANAGEMENT} component={UserWrapper} />
        <Route path={ROUTES?.MAIN} component={DashboardWrapper} />
        <Route path="*" exact component={Error404} />
      </Switch>
    </>
  );
};

export default ContentRoutes;
