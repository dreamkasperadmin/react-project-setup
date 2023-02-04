import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ROUTES } from '../../common/constants';
import Users from './Users';

const UserWrapper = () => {
  return (
    <Switch>
      <Route exact path={ROUTES?.USERS_MANAGEMENT} component={Users} />
    </Switch>
  );
};

export default UserWrapper;
