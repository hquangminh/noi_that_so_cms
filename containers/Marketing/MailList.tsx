import { useRouter } from 'next/router';
import Link from 'next/link';

import dayjs from 'dayjs';
import { useQuery } from '@apollo/client';
import { Button, Divider, Space, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { CardTabListType } from 'antd/es/card';

import { API_EmailMarketing } from 'graphql/email-marketing/query';

import SectionContent from 'components/Fragments/SectionContent';

import { EmailMarketing } from 'interface/Marketing';

const MailListContainer = () => {
  const router = useRouter();

  const { data, loading } = useQuery<{ email_marketing: EmailMarketing[] }>(API_EmailMarketing, {
    variables: {
      status: router.query.tab === 'draft' ? { _eq: 1 } : router.query.tab === 'send' ? { _eq: 2 } : {},
      offset: (Number(router.query.page || '1') - 1) * 10,
    },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    onCompleted: ({ email_marketing }) => {
      if (email_marketing.length === 0 && router.query.page && router.query.page !== '1') onChangePage(1);
    },
  });

  const onChangeTab = (tab: string) =>
    router.replace({ query: { ...router.query, tab } }, undefined, { shallow: true });

  const onChangePage = (page: number) =>
    router.replace({ query: { ...router.query, page } }, undefined, { shallow: true });

  const columns: ColumnsType<EmailMarketing> = [
    {
      title: 'STT',
      key: 'index',
      render: (_, __, index) => (Number(router.query.page || '1') - 1) * 1 + 1 + index,
    },
    { title: 'Tên', key: 'name', dataIndex: 'name' },
    { title: 'Người tạo', key: 'creator', dataIndex: 'creator' },
    {
      title: 'Ngày tạo',
      key: 'created_at',
      dataIndex: 'created_at',
      render: (value) => dayjs(value).format('HH:mm DD/MM/YYYY'),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      align: 'center',
      render: (_, { id }) => (
        <Space split={<Divider type='vertical' />}>
          <Link href={'/marketing/email/' + id}>
            <Typography.Text type='warning'>Sửa</Typography.Text>
          </Link>
          <a>
            <Typography.Text type='danger'>Xóa</Typography.Text>
          </a>
        </Space>
      ),
    },
  ];

  return (
    <SectionContent
      tabList={TabList}
      tabBarExtraContent={AddButton}
      activeTabKey={router.query.tab?.toString() || 'all'}
      onTabChange={onChangeTab}
    >
      <Table
        columns={columns}
        dataSource={data?.email_marketing}
        loading={loading}
        pagination={{ current: Number(router.query.page || '1'), onChange: onChangePage }}
      />
    </SectionContent>
  );
};

export default MailListContainer;

const AddButton = (
  <Button type='primary'>
    <Link href='/marketing/email/add'>Tạo Email</Link>
  </Button>
);

const TabList: CardTabListType[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'draft', label: 'Nháp' },
  { key: 'send', label: 'Đã gửi' },
];
