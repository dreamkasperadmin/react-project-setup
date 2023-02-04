import { Card } from 'antd';
import React from 'react';
import UserList from './components/UserList';

const Users = () => {
  return (
    <Card>
      <div className="d-flex align-center justify-between">
        <h1>User Management</h1>
        <div id="user-addEdit-btn" />
      </div>
      <hr />
      <UserList />
    </Card>
  );
};

export default Users;
