import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Spin } from 'antd';
import { get } from 'lodash';
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../../apollo';
import { AppContext } from '../../AppContext';
import logo from '../../assets/logo.png';
import { ROUTES } from '../../common/constants';
import { formValidatorRules } from '../../common/utils';
import { LOGIN } from './graphql/Mutations';

const { required, email } = formValidatorRules;

const Login = (props) => {
  const { initializeAuth } = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  function successCallback(accessToken) {
    initializeAuth(accessToken);
    props?.history?.replace('/');
  }

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await client?.mutate({
        mutation: LOGIN,
        variables: values
      });
      const accessToken = get(response, 'data.signIn.token');
      if (successCallback) {
        successCallback(accessToken);
      }
    } catch (error) {
      if (error?.message) {
        message?.error(error?.message);
      } else {
        message?.error('Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="gx-login-container">
      <Spin spinning={loading} wrapperClassName="gx-login-content">
        <div className="gx-login-header gx-text-center mb-0">
          <img src={logo} alt="logo" />
        </div>
        <Form
          name="Login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          className="gx-login-form gx-form-row0"
        >
          <Form.Item name="login" rules={[required, email]}>
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item name="password" rules={[required]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>
          <Form.Item className="gx-text-center fill-width">
            <Button type="primary" className="fill-width" htmlType="submit">
              Login
            </Button>
          </Form.Item>
          <Form.Item className="d-flex mb-0 reset-password">
            <Link to={ROUTES?.RESET}>Forgot password ?</Link>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  );
};

export default Login;
