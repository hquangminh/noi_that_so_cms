import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Link from 'next/link';

import * as AntIcon from '@ant-design/icons';
import { Layout, Menu, SiderProps } from 'antd';
import type { MenuProps } from 'antd';

import useWindowSize from 'lib/hooks/useWindowSize';
import { ChangeSidebarCollapse, selectCollapse } from 'store/reducer/web';

import { MenuKey } from 'interface/Layout';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem(<Link href='/'>Tổng quan</Link>, MenuKey.DASHBOARD, <AntIcon.DashboardOutlined />),
  getItem('Landing Page', MenuKey.LANDING_PAGE, <AntIcon.DesktopOutlined />, [
    getItem(<Link href='/landing-page/banner'>Banner</Link>, MenuKey.LANDING_PAGE_BANNER),
  ]),
  getItem('Đơn hàng', MenuKey.ORDER, <AntIcon.FileSearchOutlined />, [
    getItem(<Link href='/order'>Tất cả</Link>, MenuKey.ORDER_ALL),
  ]),
  getItem('Sản phẩm', MenuKey.PRODUCT, <AntIcon.ShoppingOutlined />, [
    getItem(<Link href='/products'>Tất cả sản phẩm</Link>, MenuKey.PRODUCT_LIST),
    getItem(<Link href='/products/add'>Thêm sản phẩm</Link>, MenuKey.PRODUCT_ADD),
  ]),
  getItem('Danh mục', MenuKey.CATEGORY, <AntIcon.UnorderedListOutlined />, [
    getItem(<Link href='/category/room'>Loại phòng</Link>, MenuKey.CATEGORY_ROOM),
    getItem(<Link href='/category/style'>Phong cách</Link>, MenuKey.CATEGORY_STYLE),
    getItem(<Link href='/category/product'>Sản phẩm</Link>, MenuKey.CATEGORY_PRODUCT),
    getItem(<Link href='/category/hashtag'>Hashtag</Link>, MenuKey.CATEGORY_HASHTAG),
  ]),
  getItem('Portfolio', MenuKey.PORTFOLIO, <AntIcon.BookOutlined />, [
    getItem(<Link href='/portfolio'>Tất cả Portfolio</Link>, MenuKey.PORTFOLIO_LIST),
    getItem(<Link href='/portfolio/add'>Thêm Portfolio</Link>, MenuKey.PORTFOLIO_ADD),
  ]),
  getItem('Blog', MenuKey.BLOG, <AntIcon.ReadOutlined />, [
    getItem(<Link href='/blogs'>Tất cả blog</Link>, MenuKey.BLOG_LIST),
    getItem(<Link href='/blogs/add'>Thêm blog</Link>, MenuKey.BLOG_ADD),
    getItem(<Link href='/blogs/category'>Danh mục</Link>, MenuKey.BLOG_CATEGORY),
  ]),
  getItem('Đối tác', MenuKey.PARTNER, <AntIcon.SolutionOutlined />, [
    getItem(<Link href='/partner'>Danh sách đối tác</Link>, MenuKey.PARTNER_LIST),
    getItem(<Link href='/partner/add'>Thêm đối tác</Link>, MenuKey.PARTNER_ADD),
  ]),
  getItem('Marketing', MenuKey.MARKETING, <AntIcon.NotificationOutlined />, [
    getItem(<Link href='/marketing/seo'>SEO</Link>, MenuKey.MARKETING_SEO),
    getItem(<Link href='/marketing/email'>Email quảng cáo</Link>, MenuKey.MARKETING_SEND_MAIL),
  ]),
  getItem(<Link href='/accounts'>Quản trị viên</Link>, MenuKey.ACCOUNT, <AntIcon.TeamOutlined />),
  getItem(<Link href='/media'>Thư viện</Link>, MenuKey.MEDIA, <AntIcon.PictureOutlined />),
];

type LayoutSidebarProps = { menuOpen?: MenuKey[]; menuSelected?: MenuKey[] };

const LayoutSidebar = ({ menuOpen, menuSelected }: LayoutSidebarProps) => {
  const dispatch = useDispatch();
  const collapsed = useSelector(selectCollapse);

  const [screenW] = useWindowSize();

  const isTablet = typeof screenW === 'number' && screenW <= 1024;
  const defaultOpenKeys = !collapsed ? menuOpen : undefined;

  useEffect(() => {
    if (typeof collapsed === 'undefined') {
      const collapsed = localStorage.getItem('collapsed');
      if (collapsed) dispatch(ChangeSidebarCollapse(collapsed === 'true'));
      else dispatch(ChangeSidebarCollapse(isTablet));
    } else if (!collapsed && isTablet) dispatch(ChangeSidebarCollapse(true));
  }, [collapsed, isTablet, dispatch]);

  const onChangeCollapse = (collapsed: boolean) => {
    dispatch(ChangeSidebarCollapse(collapsed));
    localStorage.setItem('collapsed', collapsed ? 'true' : 'false');
  };

  const sidebarProps: SiderProps = {
    theme: 'light',
    width: 220,
    collapsedWidth: 60,
    collapsed,
    collapsible: !isTablet,
    onCollapse: onChangeCollapse,
  };

  return (
    <Layout.Sider {...sidebarProps}>
      <Menu
        defaultOpenKeys={defaultOpenKeys}
        defaultSelectedKeys={menuSelected}
        mode='inline'
        items={items}
      />
    </Layout.Sider>
  );
};

export default LayoutSidebar;
