import { Layout } from 'antd';
import React from 'react';
import './App.css';
import AppHeader from './components/header/AppHeader';
import Sidebar from './components/sidebar/Sidebar';
import ContentRoutes from './ContentRoutes';

const { Content, Footer } = Layout;

const App = () => {
  return (
    <Layout className="gx-app-layout">
      <Sidebar />
      <Layout>
        <AppHeader />
        <Content className="gx-layout-content">
          <div className="gx-main-content-wrapper">
            <ContentRoutes />
          </div>
          <Footer>
            <div className="gx-layout-footer-content">
              {' '}
              © {new Date().getFullYear()}
            </div>
          </Footer>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
