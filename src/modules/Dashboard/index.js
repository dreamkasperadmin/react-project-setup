import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ROUTES } from '../../common/constants';
import Dashboard from './Dashboard';

const DashboardWrapper = () => {
  return (
    <Switch>
      <Route exact path={ROUTES?.MAIN} component={Dashboard} />
    </Switch>
  );
};

export default DashboardWrapper;
