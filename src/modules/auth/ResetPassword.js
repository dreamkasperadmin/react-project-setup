import { UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Spin } from 'antd';
import React, { useState } from 'react';
import client from '../../apollo';
import { ROUTES } from '../../common/constants';
import { formValidatorRules } from '../../common/utils';
import { FORGOT_PASSWORD } from './graphql/Mutations';

const { required, email } = formValidatorRules;

const ResetPassword = (props) => {
  const [loading, setLoading] = useState(false);
  const onFinish = async (values) => {
    setLoading(true);
    client
      .mutate({
        mutation: FORGOT_PASSWORD,
        variables: values
      })
      .then(() => {
        message?.success(
          'Reset password link sent to your email please check your email'
        );
      })
      .catch((error) => {
        if (error?.message) {
          message?.error(error?.message);
        } else {
          message?.error('Something went wrong');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <div className="gx-login-container">
      <div className="gx-login-content">
        <div className="gx-mb-4">
          <h2>Forgot Your Password ?</h2>
          <p>
            Don't worry. Recovering the password is easy.Just tell us the email.
          </p>
        </div>
        <Spin spinning={false}>
          <Form
            layout="vertical"
            onFinish={onFinish}
            className="gx-login-form gx-form-row0"
          >
            <Form.Item name="email" rules={[required, email]}>
              <Input prefix={<UserOutlined />} placeholder="Email" />
            </Form.Item>
            <div className="d-flex">
              <Form.Item>
                <Button
                  type="primary"
                  loading={loading}
                  className="mr-2"
                  htmlType="submit"
                >
                  Reset Password
                </Button>
              </Form.Item>
              <Form.Item>
                <Button
                  onClick={() => {
                    props?.history?.push(ROUTES?.LOGIN);
                  }}
                >
                  Cancel
                </Button>
              </Form.Item>
            </div>
          </Form>
        </Spin>
      </div>
    </div>
  );
};

export default ResetPassword;
