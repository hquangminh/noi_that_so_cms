import { useState } from 'react';
import { useSelector } from 'react-redux';

import { useMutation, useQuery } from '@apollo/client';
import { UserAddOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Modal, Row, Space, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';

import { handleErrorCatch } from 'lib/utils';
import { getMe } from 'store/reducer/auth';
import { API_Account } from 'graphql/account/query';
import { API_DeleteAccount } from 'graphql/account/mutation';

import SectionContent from 'components/Fragments/SectionContent';
import AccountForm, { AccountFormType } from 'components/Pages/Accounts/Form';
import * as handleNotification from 'components/Pages/Accounts/Notification';

import { AccountType } from 'interface/Account';

const ListAccount = () => {
  const [modal, contextHolder] = Modal.useModal();

  const me = useSelector(getMe);

  const [formStatus, setFormStatus] = useState<AccountFormType>('close');
  const [dataEdit, setDataEdit] = useState<AccountType>();

  const { loading, data, refetch } = useQuery<{ account: AccountType[] }>(API_Account, {
    fetchPolicy: 'network-only',
  });
  const [onDeleteAccount] = useMutation(API_DeleteAccount);

  const handleDelete = async (accountID: number) => {
    await onDeleteAccount({ variables: { id: accountID } })
      .then(() => {
        refetch();
        handleNotification.DeleteAccountSuccess();
      })
      .catch((err) => handleErrorCatch(err, () => handleNotification.DeleteAccountFail()));
  };

  const handleConfirmDelete = (accountID: number) => {
    if (accountID === me?.id) {
      handleNotification.CantDeleteMySelf();
      return;
    }

    const modalConfirm = modal.confirm({
      title: 'Bạn có chắc chắc muốn xóa quản trị viên này?',
      cancelText: 'Hủy',
      okText: 'Xác nhận',
      onOk: async () =>
        await Promise.all([
          modalConfirm.update({ cancelButtonProps: { disabled: true } }),
          handleDelete(accountID),
        ]),
    });
  };

  const columns: ColumnsType<AccountType> = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      render: (_, record) => data && data.account.indexOf(record) + 1,
    },
    {
      title: 'Tên đăng nhập',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Họ',
      dataIndex: 'first_name',
      key: 'first_name',
    },
    {
      title: 'Tên',
      dataIndex: 'last_name',
      key: 'last_name',
    },
    {
      title: 'Thao tác',
      dataIndex: 'actions',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <Space split={<Divider type='vertical' />}>
          <a onClick={(e) => e.preventDefault()}>
            <Typography.Text
              type='warning'
              onClick={() => {
                setDataEdit(record);
                setFormStatus('edit');
              }}
            >
              Sửa
            </Typography.Text>
          </a>
          <a onClick={(e) => e.preventDefault()}>
            <Typography.Text type='danger' onClick={() => handleConfirmDelete(record.id)}>
              Xóa
            </Typography.Text>
          </a>
        </Space>
      ),
    },
  ];

  return (
    <SectionContent>
      <Row gutter={[0, 24]} justify='end'>
        <Col flex='none'>
          <Button type='primary' icon={<UserAddOutlined />} onClick={() => setFormStatus('add')}>
            Tạo tài khoản
          </Button>
        </Col>

        <Col span={24}>
          <Table loading={loading} columns={columns} dataSource={data?.account} rowKey='id' />
        </Col>
      </Row>

      <AccountForm
        type={formStatus}
        data={dataEdit}
        onClose={() => setFormStatus('close')}
        onSuccess={refetch}
      />

      {contextHolder}
    </SectionContent>
  );
};

export default ListAccount;
