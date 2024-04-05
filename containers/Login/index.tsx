import { useState } from 'react';
import { useRouter } from 'next/router';

import { styled } from 'styled-components';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Button, Form, Input, notification } from 'antd';

import { setCookiesByName } from 'lib/utils';
import authServices from 'services/auth-services';

const md5 = require('md5');

const LoginWrapper = styled.main`
  display: flex;
  align-items: center;
  justify-content: center;

  min-height: 100vh;
  padding: 100px 20px;

  background-image: url('/static/images/login-background.jpeg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;

  .ant-form {
    width: 100%;
    max-width: 350px;
    padding: 20px;
    background-color: ${({ theme }) => theme.bodyColor};
    border-radius: ${({ theme }) => theme.borderRadius};
  }

  .ant-input-affix-wrapper:not(.ant-input-affix-wrapper-status-error) .site-form-item-icon {
    color: rgba(0, 0, 0, 0.25);
  }
`;

const LoginContainer = () => {
  const { replace, query } = useRouter();

  const [isLogging, setIsLogging] = useState<boolean>(false);

  const onLogin = async (values: { username: string; password: string }) => {
    setIsLogging(true);
    await authServices
      .login({ ...values, password: md5(values.password) })
      .then(({ data }) => {
        setCookiesByName('token', data.token);
        replace(query.redirect?.toString() || '/');
      })
      .catch(() => {
        setIsLogging(false);
        notification.error({
          message: 'Đăng nhập không thành công',
          description: 'Tên đăng nhập hoặc mật khẩu không chính xác',
        });
      });
  };

  return (
    <LoginWrapper>
      <Form layout='vertical' onFinish={onLogin}>
        <Form.Item name='username' rules={[{ required: true, message: 'Tên đăng nhập không được để trống' }]}>
          <Input prefix={<UserOutlined className='site-form-item-icon' />} placeholder='Tên đăng nhập' />
        </Form.Item>

        <Form.Item name='password' rules={[{ required: true, message: 'Mật khẩu không được để trống' }]}>
          <Input.Password prefix={<LockOutlined className='site-form-item-icon' />} placeholder='Mật khẩu' />
        </Form.Item>

        <Button type='primary' htmlType='submit' block loading={isLogging}>
          Đăng nhập
        </Button>
      </Form>
    </LoginWrapper>
  );
};

export default LoginContainer;
