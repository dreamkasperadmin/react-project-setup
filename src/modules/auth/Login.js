import { Button, Divider, Form, Input } from 'antd';
import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AppContext } from '../../AppContext';
import { Email, PasswordIcon } from '../../assets/svg';
import { ROUTES } from '../../common/constants';
import { formValidatorRules } from '../../common/utils';
import {
  SignInWithEmailAndPassword
} from './Firebase';

const { required } = formValidatorRules;

const Login = () => {
  const history = useHistory();
  const [loginLoading, setLoginLoading] = useState(false);
  const { initializeAuth } = useContext(AppContext);

  async function successCallback(
    accessToken,
    userData,
  ) {
    initializeAuth(accessToken, userData);
    setLoginLoading(false);
    history.replace('/');
  }

  const onFinish = async (formValues) => {
    try {
      const loggedIn = await SignInWithEmailAndPassword(
        formValues?.email,
        formValues?.password,
        setLoginLoading
      );
      if (loggedIn?.token) {
        successCallback(
          loggedIn?.token,
          loggedIn?.userData,
          loggedIn?.isEmailVerified,
          loggedIn?.success
        );
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  return (
    <div style={{ height: '100%' }} className="d-flex">
        <div className="login-screen">
          <h1>Login</h1>
          <Divider />
          <div className="login-form">
            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item label="Email" name="email" rules={[required]}>
                <Input prefix={<Email />} placeholder="Enter your Email" />
              </Form.Item>
              <Form.Item
                label="Password"
                className="mt-25"
                name="password"
                rules={[required]}
              >
                <Input.Password
                  placeholder="Enter your Password"
                  prefix={<PasswordIcon />}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  className="fill-width"
                  htmlType="submit"
                  loading={loginLoading}
                >
                  Login
                </Button>
              </Form.Item>
              <div className="d-flex justify-center font-18 mt-25 flex-wrap">
                Forgot your password?
                <b
                  className="ml-5 pointer text-underline"
                  onClick={() => {
                    history.push(ROUTES.RESET);
                  }}
                >
                  Recover Password
                </b>
              </div>
            </Form>
          </div>
      </div>
    </div>
  );
};

export default Login;
