import { Layout } from 'antd';
import React from 'react';
import UserProfile from './UserProfile';

const { Header } = Layout;

const AppHeader = () => {
  return (
    <Header>
      <div className="gx-search-bar gx-d-none gx-d-lg-block gx-lt-icon-search-bar-lg">
        <div className="d-flex align-center" />
      </div>
      <div className="header-notification">
        <UserProfile />
      </div>
    </Header>
  );
};
export default AppHeader;
