import { useMutation } from '@apollo/client';
import { Form, Input, Select, Switch } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import { values } from 'lodash';
import React from 'react';
import ReactInputMask from 'react-input-mask';
import { REGEX, ROLE_KEYS } from '../../common/constants';
import {
  formatPhoneNumberWithoutMask,
  formValidatorRules
} from '../../common/utils';
import { CREATE_USER, UPDATE_USER } from './graphql/Mutations';

const { Option } = Select;
const { required, email } = formValidatorRules;

const AddUserModal = (props) => {
  const {
    isUpdate,
    showModal,
    setShowModal,
    userData,
    setUserData,
    refetchUserDataWithInitialValues,
    refetchUserData
  } = props;
  const [form] = Form.useForm();
  const [createUserMutate, { loading: createUserLoading }] = useMutation(
    CREATE_USER,
    {
      onError() {}
    }
  );

  const [updateUserMutate, { loading: updateUserLoading }] = useMutation(
    UPDATE_USER,
    {
      onError() {}
    }
  );

  const handleCancel = () => {
    setShowModal(false);
    form?.resetFields();
    setUserData();
  };

  const onUserSubmitFinish = async (formValues) => {
    const newFormValues = {
      ...formValues,
      phoneNo: formatPhoneNumberWithoutMask(formValues.phoneNo)
    };

    const variables = isUpdate
      ? { data: newFormValues, id: userData.id }
      : newFormValues;

    try {
      if (isUpdate) {
        const response = await updateUserMutate({
          variables: { ...variables }
        });
        if (response?.data?.adminUpdateUser) {
          setUserData();
          form?.resetFields();
          setShowModal(false);
          refetchUserData();
        }
        return response;
      }
      const response = await createUserMutate({
        variables: { data: { ...variables } }
      });
      if (response?.data?.adminCreateUser) {
        setUserData();
        form?.resetFields();
        setShowModal(false);
        refetchUserDataWithInitialValues();
      }
    } catch (error) {
      return error;
    }
  };

  const handleAdd = () => {
    setShowModal(true);
    form?.submit();
  };

  return (
    <Modal
      title={isUpdate ? 'Edit user' : 'Add user'}
      visible={showModal}
      confirmLoading={createUserLoading || updateUserLoading}
      onOk={handleAdd}
      className="dialog"
      okText={isUpdate ? 'Save' : 'Add'}
      onCancel={handleCancel}
    >
      <Form
        form={form}
        initialValues={userData || { isActive: true }}
        layout="vertical"
        onFinish={onUserSubmitFinish}
      >
        <Form.Item rules={[required]} name="firstName" label="First Name">
          <Input allowClear name="Firstname" />
        </Form.Item>
        <Form.Item rules={[required]} name="lastName" label="Last name">
          <Input allowClear name="Lastname" />
        </Form.Item>
        <Form.Item
          label="Contact"
          name="phoneNo"
          rules={[
            required,
            () => ({
              validator(rule, value) {
                if (value) {
                  // eslint-disable-next-line no-param-reassign
                  value = value?.split(' ')?.join('');
                  const numberPattern = REGEX?.PHONE;
                  if (!numberPattern?.test(value)) {
                    // eslint-disable-next-line prefer-promise-reject-errors
                    return Promise?.reject('should be a valid phone number');
                  }
                }
                return Promise?.resolve();
              }
            })
          ]}
        >
          <ReactInputMask
            mask="(999) 999-9999"
            placeholder="(___) ___-____"
            min={10}
            className="col"
            allowClear
          >
            {(inputProps) => <Input {...inputProps} />}
          </ReactInputMask>
        </Form.Item>
        <Form.Item rules={[required, email]} name="email" label="Email">
          <Input allowClear name="Email" />
        </Form.Item>
        <Form.Item
          rules={[{ required, message: 'Required', type: 'array' }]}
          name="roles"
          label="Roles"
        >
          <Select
            className="mr-3"
            placeholder="Select Roles"
            allowClear
            mode="multiple"
          >
            {values(ROLE_KEYS).map((role) => (
              <Option key={role} value={role}>
                {role}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="isActive" label="Status" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddUserModal;
