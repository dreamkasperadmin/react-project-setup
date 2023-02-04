import { MoreOutlined } from '@ant-design/icons';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Button, Popover, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { formatPhoneNumber } from '../../../common/utils';
import CommonTable from '../../../components/CommonTable';
import Portal from '../../../components/Portal';
import SearchComponent from '../../../components/SearchComponent';
import AddUserModal from '../AddUserModal';
import { UPDATE_USER } from '../graphql/Mutations';
import { GET_USERS } from '../graphql/Queries';

const UserList = () => {
  const initialUserFilter = {
    skip: 0,
    limit: 10,
    sortOn: 'updatedAt',
    sortBy: 'DESC'
  };

  const initialPaginationValue = {
    total: 0,
    current: 1
  };

  const [paginationProp, setPaginationProp] = useState(initialPaginationValue);

  const [showModal, setShowModal] = useState(false);
  const [userData, setUserData] = useState();
  const [sortedInfo, setSortedInfo] = useState({});

  const [userFilter, setUserFilter] = useState(initialUserFilter);

  const [updateUserMutate, { loading: updateUserLoading }] = useMutation(
    UPDATE_USER,
    {
      onError() {}
    }
  );

  const [fetchUserData, { loading, data, refetch }] = useLazyQuery(GET_USERS, {
    fetchPolicy: 'network-only',
    onCompleted: (res) => {
      const pagination = {
        ...paginationProp,
        defaultPageSize: 10,
        total: res?.users?.count
      };
      setPaginationProp(pagination);
    },
    onError() {}
  });

  useEffect(() => {
    fetchUserData({ variables: { filter: userFilter } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refetchUserDetails = () => {
    setSortedInfo({});
    setUserFilter({
      skip: 0,
      limit: 10,
      sortOn: 'updatedAt',
      sortBy: 'DESC'
    });
    setPaginationProp(initialPaginationValue);
    fetchUserData({ variables: { filter: { ...initialUserFilter } } });
  };

  const handleAddEditUser = () => {
    setShowModal(true);
  };

  const handleTableChange = (pagination, filter, sorter) => {
    const { current } = pagination;
    const skip = (current - 1) * pagination.pageSize;
    setSortedInfo(sorter);
    setUserFilter({ ...userFilter, skip, limit: pagination.pageSize });
    setPaginationProp({ ...paginationProp, ...pagination });
    if (sorter?.column) {
      setUserFilter({
        ...userFilter,
        sortOn: sorter.field,
        sortBy: sorter.order === 'ascend' ? 'ASC' : 'DESC'
      });
      fetchUserData({
        variables: {
          filter: {
            ...userFilter,
            skip,
            limit: pagination.pageSize,
            sortOn: sorter.field,
            sortBy: sorter.order === 'ascend' ? 'ASC' : 'DESC'
          }
        }
      });
    } else {
      setUserFilter({
        ...userFilter,
        sortOn: 'updatedAt',
        sortBy: 'DESC'
      });
      fetchUserData({
        variables: {
          filter: {
            ...userFilter,
            skip,
            limit: pagination.pageSize,
            sortOn: 'updatedAt',
            sortBy: 'DESC'
          }
        }
      });
    }
  };

  const handleUserStatus = async (e, editUserData) => {
    e?.preventDefault();
    const editData = { ...editUserData, isActive: !editUserData.isActive };
    // eslint-disable-next-line no-underscore-dangle
    delete editData.__typename;
    delete editData.id;
    const response = await updateUserMutate({
      variables: { data: { ...editData }, id: editUserData.id }
    });
    if (response?.data?.adminUpdateUser) {
      refetch();
    }
  };

  const renderActionButtons = (editUserData) => {
    return (
      <div className="d-flex flex-vertical">
        <Button
          id="user-table-edit-btn"
          className="b-0"
          onClick={() => {
            setUserData(editUserData);
            handleAddEditUser();
          }}
        >
          Edit
        </Button>
        <Button
          id="user-table-status-btn"
          className="b-0"
          onClick={(e) => handleUserStatus(e, editUserData)}
        >
          {editUserData?.isActive ? 'Mark Inactive' : 'Mark Active'}
        </Button>
      </div>
    );
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'firstName',
      key: 'firstName',
      sorter: true,
      sortOrder: sortedInfo?.columnKey === 'firstName' && sortedInfo?.order,
      render: (text, record) => {
        return `${record?.firstName} ${record?.lastName}`;
      }
    },
    {
      title: 'Roles',
      dataIndex: 'roles',
      key: 'roles',
      sorter: true,
      sortOrder: sortedInfo?.columnKey === 'roles' && sortedInfo?.order,
      render: (role, record) => {
        return role?.map((roleData) => (
          <Tag key={`${roleData}-${record?.id}`}>{roleData?.toUpperCase()}</Tag>
        ));
      }
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: true,
      sortOrder: sortedInfo?.columnKey === 'email' && sortedInfo?.order,
      key: 'email'
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNo',
      key: 'phoneNo',
      sorter: true,
      sortOrder: sortedInfo?.columnKey === 'phoneNo' && sortedInfo?.order,
      render: (phone) => {
        return formatPhoneNumber(phone);
      }
    },
    {
      title: 'Active',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => {
        if (isActive) {
          return <Tag color="green">Active</Tag>;
        }

        return <Tag color="red">Deactive</Tag>;
      }
    },
    {
      title: 'Action',
      dataIndex: 'id',
      render: (id, record) => {
        return (
          <Popover placement="bottom" content={renderActionButtons(record)}>
            <MoreOutlined />
          </Popover>
        );
      }
    }
  ];

  const onSearchChange = async (value) => {
    setUserFilter({ ...userFilter, skip: 0, search: value });
    fetchUserData({
      variables: { filter: { ...userFilter, skip: 0, search: value } }
    });
  };

  return (
    <>
      {showModal && (
        <AddUserModal
          showModal={showModal}
          setShowModal={setShowModal}
          setUserData={setUserData}
          userData={userData}
          isUpdate={!!userData}
          refetchUserDataWithInitialValues={refetchUserDetails}
          refetchUserData={refetch}
        />
      )}
      <Portal portalId="user-addEdit-btn">
        <Button type="primary" onClick={handleAddEditUser}>
          Add User
        </Button>
      </Portal>
      <div className="mb-10 width-percent-20">
        <SearchComponent
          id="search-container-id"
          name="Users"
          getData={onSearchChange}
        />
      </div>
      <CommonTable
        loadingData={loading || updateUserLoading}
        columns={columns}
        data={data?.users?.data || []}
        onChange={handleTableChange}
        paginationConfig={paginationProp}
        rowKey={(obj) => obj.id}
      />
    </>
  );
};

export default UserList;
