import Router from 'next/router';

import { AxiosError } from 'axios';
import { ApolloError } from '@apollo/client';
import { notification } from 'antd';

const handleErrorCatch = (error: any, callback: Function = () => undefined) => {
  if (error instanceof ApolloError) {
    const { graphQLErrors } = error;
    if (graphQLErrors?.some((err) => err.extensions.code === 'invalid-headers')) {
      Router.push(`/login?redirect=${Router.asPath}`);
      notification.info({
        key: 'login-session-expired',
        message: 'Phiên đăng nhập đã hết hạn',
        description: 'Vui lòng đăng nhập để tiếp tục sử dụng',
      });
      return;
    } else return callback.apply(this);
  } else if (error instanceof AxiosError) {
    const axiosError: AxiosError = error;
    const { name, code, status, response } = axiosError;
    if (status === 401 || response?.status === 401) {
      Router.push(`/login?redirect=${Router.asPath}`);
      notification.info({
        key: 'login-session-expired',
        message: 'Phiên đăng nhập đã hết hạn',
        description: 'Vui lòng đăng nhập để tiếp tục sử dụng',
      });
      return;
    } else if (response && code === 'ERR_NETWORK') {
      notification.error({
        key: 'network-error',
        message: 'Không có kết nối mạng',
        description: 'Vui lòng kiểm tra mạng của bạn và thử lại',
      });
      return;
    } else return callback.apply(this);
  } else return callback.apply(this);
};

export default handleErrorCatch;
