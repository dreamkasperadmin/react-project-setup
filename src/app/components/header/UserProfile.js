import { DownOutlined } from '@ant-design/icons';
import { Avatar, Popover } from 'antd';
import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AppContext } from '../../../AppContext';
import { ROUTES } from '../../../common/constants';

const UserProfile = () => {
  const { getCurrentUser } = useContext(AppContext);
  const [visible, setVisible] = useState(false);

  const history = useHistory();

  const handleVisibleChange = (value) => {
    setVisible(value);
  };

  const { firstName = '', lastName = '' } = getCurrentUser() || {};
  const userMenuOptions = (
    <ul className="gx-user-popover">
      <li
        onClick={() => {
          history?.push(ROUTES?.LOGOUT);
        }}
      >
        Logout
      </li>
    </ul>
  );

  return (
    <div className="gx-avatar-row">
      <Popover
        className="d-flex flex-row align-center"
        placement="bottomRight"
        content={userMenuOptions}
        trigger="click"
        visible={visible}
        onVisibleChange={handleVisibleChange}
      >
        <Avatar className="gx-size-35 gx-pointer mr-5" alt="Avatar" />

        <span className="gx-avatar-name d-flex flex-row align-center">
          {`${firstName} ${lastName}`}
          <DownOutlined className=" gx-fs-xxs ml-2" />
        </span>
      </Popover>
    </div>
  );
};

export default UserProfile;
