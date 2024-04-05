import { Fragment } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import dayjs from 'dayjs';
import { useQuery } from '@apollo/client';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Image, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';

import { removeSpaceString } from 'functions';
import { handleErrorCatch } from 'lib/utils';
import { API_GetPartner } from 'graphql/partner/query';

import SectionContent from 'components/Fragments/SectionContent';
import PartnerFilter from 'components/Pages/Partner/Filter';

import { PartnerType } from 'interface/Partner';

const PartnerListContainer = () => {
  const { replace, query } = useRouter();

  let status = 2;
  if (query.tab === 'waiting_for_progressing') status = 1;
  else if (query.tab === 'denied') status = 3;

  const { data, loading } = useQuery<{ partner: PartnerType[] }>(API_GetPartner, {
    variables: { status, name: query.name ? `%${removeSpaceString(query.name.toString())}%` : undefined },
    fetchPolicy: 'network-only',
    onError: (error) => handleErrorCatch(error),
  });

  const columns: ColumnsType<PartnerType> = [
    {
      title: 'Tên đối tác',
      dataIndex: 'name',
      key: 'name',
      render: (name) => <p style={{ maxWidth: 600 }}>{name}</p>,
    },
    {
      title: 'Logo',
      dataIndex: 'logo',
      key: 'logo',
      render: (image) =>
        image ? (
          <Image
            src={image}
            alt=''
            width={100}
            height={60}
            preview={false}
            style={{ objectFit: 'contain' }}
          />
        ) : null,
    },
    { title: 'Số điện thoại', dataIndex: 'phone_number', key: 'phone_number' },
    {
      title: 'Ngày đăng ký',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => dayjs(date).format('HH:mm DD/MM/YYYY'),
    },
    {
      title: 'Thao tác',
      dataIndex: 'actions',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <Link href={`/partner/${record.id}`}>
          <Typography.Text type='warning'>Xem</Typography.Text>
        </Link>
      ),
    },
  ];

  return (
    <Fragment>
      <PartnerFilter />

      <SectionContent
        tabBarExtraContent={
          <Button type='primary' icon={<PlusOutlined />}>
            <Link href='/partner/add'>Thêm đối tác</Link>
          </Button>
        }
        tabList={[
          { key: 'waiting_for_progressing', tab: 'Chờ xử lý' },
          { key: 'approved', tab: 'Đã duyệt' },
          { key: 'denied', tab: 'Từ chối' },
        ]}
        activeTabKey={query.tab?.toString() || 'approved'}
        onTabChange={(tab) => replace({ query: { ...query, tab } }, undefined, { shallow: true })}
      >
        <Table
          rowKey='id'
          loading={loading}
          columns={columns}
          dataSource={data?.partner}
          scroll={{ x: true }}
        />
      </SectionContent>
    </Fragment>
  );
};

export default PartnerListContainer;
