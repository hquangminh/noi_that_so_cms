import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { styled } from 'styled-components';
import { useLazyQuery } from '@apollo/client';
import { FileSearchOutlined } from '@ant-design/icons';
import { Col, ConfigProvider, Descriptions, Divider, Row, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { CardTabListType } from 'antd/es/card';

import { priceFormatter, removeEmptyObject } from 'functions';
import { handleErrorCatch } from 'lib/utils';
import { orderStatus, orderStatusLogs } from 'common/constants';
import { API_GetOrder } from 'graphql/order/query';

import SectionContent from 'components/Fragments/SectionContent';
import OrderFilterPanel from 'components/Pages/Order/FilterPanel';

import { OrderStatus, OrderStatusKey, OrderType } from 'interface/Order';

import { TextLineClamp } from 'lib/styles';

const Wrapper = styled.div`
  .ant-table-cell {
    vertical-align: top;
  }
`;

type OrderResponse = {
  order: OrderType[];
  order_aggregate: { aggregate: { count: number } };
};

const OrderListContainer = () => {
  const router = useRouter();

  const [onFetchOrder, { loading, data }] = useLazyQuery<OrderResponse>(API_GetOrder, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    onCompleted: ({ order }) => {
      if (!order.length && router.query.page && router.query.page !== '1') onChangePage();
    },
    onError: handleErrorCatch,
  });

  const onFilterOrder = useCallback(() => {
    let filter: Record<string, any> = {};
    let sort: Record<string, string> = {};

    const { tab, order_code, sort: sortBy, page } = router.query;

    if (order_code) filter['order_no'] = { _eq: order_code };

    if (tab && tab !== 'all')
      filter['status'] = { _eq: OrderStatus[tab.toString().toUpperCase() as unknown as OrderStatus] };

    if (sortBy === 'oldest') sort['created_at'] = 'asc';
    else sort['created_at'] = 'desc';

    onFetchOrder({ variables: { filter, sort, offset: (Number(page || 1) - 1) * 10 } });
  }, [router.query, onFetchOrder]);

  useEffect(() => {
    onFilterOrder();
  }, [onFilterOrder]);

  const onChangeTab = (tab: string) =>
    router.replace({ query: { ...router.query, tab, page: 1 } }, undefined, { shallow: true });

  const onChangePage = (page?: number) =>
    router.replace({ query: removeEmptyObject({ ...router.query, page }) }, undefined, { shallow: true });

  return (
    <Wrapper>
      <OrderFilterPanel />

      <SectionContent
        tabList={TabList}
        activeTabKey={router.query.tab?.toString().toUpperCase() || 'ALL'}
        onTabChange={(key) => onChangeTab(key.toLowerCase())}
      >
        <Table
          loading={loading}
          columns={columns}
          dataSource={data?.order}
          sticky={true}
          pagination={{
            current: Number(router.query.page || 1),
            total: data?.order_aggregate.aggregate.count,
            onChange: onChangePage,
          }}
        />
      </SectionContent>
    </Wrapper>
  );
};

export default OrderListContainer;

const TabList: CardTabListType[] = [
  { key: 'ALL', label: 'Tất cả' },
  { key: OrderStatusKey.NEW, label: 'Mới' },
  { key: OrderStatusKey.PROCESSING, label: 'Đang xử lý' },
  { key: OrderStatusKey.PREPARING, label: 'Đang chuẩn bị' },
  { key: OrderStatusKey.SHIPPING, label: 'Đang giao hàng' },
  { key: OrderStatusKey.SUCCESS, label: 'Đã hoàn tất' },
  { key: OrderStatusKey.CANCEL, label: 'Đã hủy' },
];

const columns: ColumnsType<OrderType> = [
  {
    key: 'order_info',
    title: 'Thông tin đơn hàng',
    width: '40%',
    render: (_, record) => {
      return (
        <Descriptions column={1} size='small'>
          <Descriptions.Item label='Mã Đơn hàng'>{record.order_no}</Descriptions.Item>
          <Descriptions.Item label='Người mua'>{record.order_delivery.name}</Descriptions.Item>
          <Descriptions.Item label='Tổng Đơn hàng'>
            <strong>{priceFormatter(record.amount)}</strong>
          </Descriptions.Item>
        </Descriptions>
      );
    },
  },
  {
    key: 'order_products',
    title: 'Sản phẩm',
    width: '60%',
    render: (_, record) => {
      return (
        <Row gutter={[0, 10]}>
          {record.order_products.map((product, index) => (
            <Col span={24} key={index} style={{ maxWidth: 500 }}>
              <Row gutter={16} wrap={false}>
                <Col flex='66px'>
                  <img src={product.product_info.image} alt='' width='50px' />
                </Col>
                <Col flex='auto'>
                  <TextLineClamp style={{ marginBottom: 0, fontWeight: 500 }}>
                    {product.product_info.name}
                  </TextLineClamp>
                  <ConfigProvider theme={{ token: { paddingXS: 0 } }}>
                    <Descriptions column={1} size='small'>
                      {product.product_info.variation && (
                        <Descriptions.Item label='Phân loại'>
                          {product.product_info.variation}
                        </Descriptions.Item>
                      )}
                      <Descriptions.Item label='Giá'>
                        {priceFormatter(product.product_info.price)}
                      </Descriptions.Item>
                    </Descriptions>
                  </ConfigProvider>
                </Col>
                <Col>x{product.delivery_quantity ?? product.purchase_quantity}</Col>
              </Row>
            </Col>
          ))}

          <Col span={24}>
            <div style={{ maxWidth: 500 }}>
              <Divider dashed style={{ margin: '10px 0' }} />
              <Descriptions column={1} size='small'>
                <Descriptions.Item
                  label={`Tổng ${
                    record.products_aggregate.aggregate.count +
                    record.products_update_aggregate.aggregate.count
                  } sản phẩm`}
                  contentStyle={{ justifyContent: 'end' }}
                >
                  x
                  {record.products_aggregate.aggregate.sum.purchase_quantity +
                    record.products_update_aggregate.aggregate.sum.delivery_quantity}
                </Descriptions.Item>
              </Descriptions>
            </div>
          </Col>
        </Row>
      );
    },
  },
  {
    key: 'order_status',
    title: 'Trạng thái',
    width: '160px',
    render: (_, { status }) => <Tag color={orderStatusLogs[status].tag}>{orderStatus[status]}</Tag>,
  },
  {
    key: 'order_action',
    title: 'Thao tác',
    width: '130px',
    render: (_, { id }) => (
      <Link href={`/order/${id}`}>
        <FileSearchOutlined /> Xem chi tiết
      </Link>
    ),
  },
];
