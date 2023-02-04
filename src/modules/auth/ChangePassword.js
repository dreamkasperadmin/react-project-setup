import { LockOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Spin } from 'antd';
import { get } from 'lodash';
import React, { useState } from 'react';
import client from '../../apollo';
import { ROUTES } from '../../common/constants';
import { formValidatorRules } from '../../common/utils';
import {
  EMAIL_VALIDATION,
  RESET_PASSWORD,
  TOKEN_VALIDATION
} from './graphql/Mutations';

const { required } = formValidatorRules;

const ChangePassword = (props) => {
  const {
    history,
    history: { location: { search, pathname } = {} } = {}
  } = props;

  const getQuery = () => {
    return new URLSearchParams(search);
  };

  if (pathname === ROUTES?.VERIFY) {
    const resetToken = getQuery()?.get('token');
    client
      .query({
        query: EMAIL_VALIDATION,
        fetchPolicy: 'network-only',
        variables: {
          resetToken
        }
      })
      .catch((e) => e);
  }

  const [loading, setLoading] = useState(false);
  const onFinish = ({ password }) => {
    setLoading(true);
    const resetToken = getQuery()?.get('token');
    client
      .mutate({
        mutation: TOKEN_VALIDATION,
        variables: { resetToken }
      })
      .then(() => {
        return client?.mutate({
          mutation: RESET_PASSWORD,
          variables: { password },
          context: {
            headers: {
              'x-token': resetToken
            }
          }
        });
      })
      .then((data) => {
        const responseMessage = get(data, 'data.updateUserPassword.message');
        message?.success(responseMessage);
        history?.replace('/login');
      })
      .catch((e) => {
        if (get(e, 'response.data.message')) {
          message?.error(e?.response?.data?.message);
        } else if (e?.message) {
          message?.error(e?.message);
        } else {
          message?.error('Something went wrong');
        }
        return e;
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="gx-login-container">
      <div className="gx-login-content">
        <div className="gx-mb-4">
          <h2>Change Password</h2>
          <p>Enter a new password for your account</p>
        </div>
        <Spin spinning={false}>
          <Form
            name="change-password"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            className="gx-login-form gx-form-row0"
          >
            <Form.Item name="password" rules={[required]}>
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item
              name="retype-password"
              rules={[
                required,
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || value !== getFieldValue('password')) {
                      return Promise?.reject(
                        new Error('Passwords do not match')
                      );
                    }
                    return Promise?.resolve();
                  }
                })
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Retype password"
              />
            </Form.Item>
            <div className="d-flex">
              <Form.Item>
                <Button
                  loading={loading}
                  type="primary"
                  className="mr-2"
                  htmlType="submit"
                >
                  Change Password
                </Button>
              </Form.Item>
              <Form.Item>
                <Button
                  onClick={() => {
                    history?.push(ROUTES?.LOGIN);
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

export default ChangePassword;
