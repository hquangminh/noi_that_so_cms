import { useEffect, useState } from 'react';

import { useMutation } from '@apollo/client';
import { Button, Form, Input, Modal, ModalProps, Space } from 'antd';

import { handleErrorCatch } from 'lib/utils';
import { API_AddAccount, API_EditAccount } from 'graphql/account/mutation';

import * as handleNotification from './Notification';

import { AccountType } from 'interface/Account';

const md5 = require('md5');

export type AccountFormType = 'add' | 'edit' | 'close';
type Props = { type: AccountFormType; data?: AccountType; onClose: () => void; onSuccess: () => void };

const AccountForm = ({ type = 'add', data, onClose, onSuccess }: Props) => {
  const [form] = Form.useForm();

  const [submitting, setSubmitting] = useState<boolean>(false);

  const [addAccount] = useMutation(API_AddAccount);
  const [editAccount] = useMutation(API_EditAccount);

  useEffect(() => {
    if (data && type === 'edit') form.setFieldsValue(data);
    else form.resetFields();
  }, [type, data, form]);

  const onSubmit = async (values: any) => {
    try {
      setSubmitting(true);
      const password = values.password ? md5(values.password) : undefined;
      if (type === 'add') {
        await addAccount({ variables: { objects: { ...values, password } } });
        handleNotification.AddAccountSuccess();
      }
      if (type === 'edit') {
        await editAccount({ variables: { id: data?.id, set: { ...values, password } } });
        handleNotification.EditAccountSuccess();
      }
      setSubmitting(false);
      onClose();
      onSuccess();
    } catch (error) {
      const noti = () =>
        type === 'add' ? handleNotification.AddAccountFail() : handleNotification.EditAccountFail();
      handleErrorCatch(error, noti);
      setSubmitting(false);
    }
  };

  const modalProps: ModalProps = {
    title: (
      <div style={{ textAlign: 'center' }}>
        {(type === 'add' ? 'Tạo' : type === 'edit' ? 'Chỉnh sửa' : '') + ' quản trị viên'}
      </div>
    ),
    open: type !== 'close',
    footer: null,
    closable: false,
    destroyOnClose: true,
  };

  return (
    <Modal {...modalProps}>
      <Form form={form} layout='vertical' onFinish={onSubmit}>
        <Form.Item
          name='first_name'
          label='Họ'
          rules={[
            { required: true, message: 'Họ không được để trống' },
            { whitespace: true, message: 'Họ không được nhập khoảng trống' },
            { min: 2, message: 'Họ phải ít nhất 2 ký tự' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name='last_name'
          label='Tên'
          rules={[
            { required: true, message: 'Tên không được để trống' },
            { whitespace: true, message: 'Tên không được nhập khoảng trống' },
            { min: 2, message: 'Tên phải ít nhất 2 ký tự' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name='username'
          label='Tên đăng nhập'
          rules={[
            { required: true, message: 'Tên đăng nhập không được để trống' },
            { whitespace: true, message: 'Tên đăng nhập không được nhập khoảng trống' },
            { min: 4, message: 'Tên đăng nhập phải ít nhất 4 ký tự' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name='password'
          label='Mật khẩu'
          rules={[
            { required: type === 'add', message: 'Mật khẩu không được để trống' },
            { whitespace: true, message: 'Mật khẩu không được nhập khoảng trống' },
            { min: 8, message: 'Mật khẩu phải ít nhất 8 ký tự' },
          ]}
        >
          <Input />
        </Form.Item>

        <div style={{ textAlign: 'right' }}>
          <Space>
            <Button disabled={submitting} onClick={onClose}>
              Hủy
            </Button>
            <Button type='primary' htmlType='submit' loading={submitting}>
              Lưu
            </Button>
          </Space>
        </div>
      </Form>
    </Modal>
  );
};

export default AccountForm;
