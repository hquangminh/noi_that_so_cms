import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import { notification } from 'antd';

import { SetAuth } from 'store/reducer/auth';
import { ClientVisited, detectClientVisited } from 'store/reducer/web';

import LayoutDashboard from 'components/Layout';

import { PageProps } from 'interface/Global';
import { MenuKey } from 'interface/Layout';

type SSRComponentElements = { getInitialProps?: () => Promise<any> };

type SSRProps = {};

export type WithLayoutProps = SSRProps & {};

type PropsLayoutType = { sidebar: { openKey?: MenuKey[]; selectedKey?: MenuKey[] } };

const withLayout = (
  BaseComponent: React.ComponentType<WithLayoutProps | undefined | any> & SSRComponentElements,
  propsLayout?: PropsLayoutType,
) => {
  const App = (props: PageProps) => {
    const { replace, asPath } = useRouter();
    const dispatch = useDispatch();

    const visitedFirstTime = useSelector(detectClientVisited);

    useEffect(() => {
      if (props.auth) {
        const { token, ...me } = props.auth;
        dispatch(SetAuth({ me, token }));
      } else {
        replace(`/login${asPath !== '/' ? `?redirect=${asPath}` : ''}`);
        if (!visitedFirstTime)
          notification.info({
            key: 'login-session-expired',
            message: 'Phiên đăng nhập đã hết hạn',
            description: 'Vui lòng đăng nhập để tiếp tục sử dụng',
          });
      }
      dispatch(ClientVisited());
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!props.auth) return null;

    return (
      <LayoutDashboard
        menuOpen={propsLayout?.sidebar.openKey}
        menuSelected={propsLayout?.sidebar.selectedKey}
        auth={props.auth}
      >
        <BaseComponent {...props} />
      </LayoutDashboard>
    );
  };

  return App;
};

export default withLayout;
