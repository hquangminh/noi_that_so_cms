import React, { ReactNode } from 'react';

import { styled } from 'styled-components';
import { Layout } from 'antd';

import LayoutHeader from './Header';
import LayoutSidebar from './Sidebar';

import { MenuKey } from 'interface/Layout';
import { AccountType } from 'interface/Account';

const LayoutWrapper = styled.div`
  .ant-layout-sider {
    height: calc(100vh - 64px);
    overflow-y: auto;
  }
  .ant-layout-content {
    flex: none;
    padding: 20px;
  }
  .ant-menu {
    border-inline-end: none !important;
  }
`;

type LayoutDashboardProps = {
  menuOpen?: MenuKey[];
  menuSelected?: MenuKey[];
  auth: AccountType;
  children: ReactNode;
};

const LayoutDashboard = ({ menuOpen, menuSelected, auth, children }: LayoutDashboardProps) => {
  return (
    <LayoutWrapper>
      <Layout>
        <LayoutHeader auth={auth} />
        <Layout hasSider>
          <LayoutSidebar menuOpen={menuOpen} menuSelected={menuSelected} />
          <Layout style={{ height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
            <Layout.Content style={{ position: 'relative', minWidth: 1024 - 60 }}>{children}</Layout.Content>
          </Layout>
        </Layout>
      </Layout>
    </LayoutWrapper>
  );
};

export default LayoutDashboard;
