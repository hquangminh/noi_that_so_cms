import { useContext } from 'react';

import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, ConfigProvider, Descriptions, Form, InputNumber, Row, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';

import { priceFormatter } from 'functions';

import SectionContent from 'components/Fragments/SectionContent';
import TitleColumnTooltip from 'components/Fragments/TitleColumnTooltip';
import { OrderContext } from './OrderProvider';

import { OrderProductItem, OrderStatus } from 'interface/Order';

import { TextLineClamp } from 'lib/styles';

const OrderProductList = () => {
  const { order, openEditQuantity, onChangeOpenAddProduct, allowEditProduct } = useContext(OrderContext);

  const columns: ColumnsType<OrderProductItem> = [
    { key: 'index', title: 'STT', align: 'right', render: (_, __, index) => index + 1 },
    {
      key: 'info',
      title: 'Sản phẩm',
      render: (_, { product, product_info }) => (
        <Row gutter={16} wrap={false} align='stretch'>
          <Col>
            <img src={product_info.image} alt='' width='50' height='50' style={{ objectFit: 'contain' }} />
          </Col>
          <Col flex='auto' style={{ alignSelf: 'center' }}>
            <TextLineClamp style={{ marginBottom: 0, fontWeight: 500 }}>{product_info.name}</TextLineClamp>
            <ConfigProvider theme={{ components: { Descriptions: { itemPaddingBottom: 0 } } }}>
              <Descriptions column={1}>
                {product_info.variation && (
                  <Descriptions.Item label='Phân loại'>{product_info.variation}</Descriptions.Item>
                )}
                {product.partner && (
                  <Descriptions.Item label='Đối tác'>{product.partner.name}</Descriptions.Item>
                )}
              </Descriptions>
            </ConfigProvider>
          </Col>
        </Row>
      ),
    },
    {
      key: 'price',
      title: 'Đơn giá',
      align: 'right',
      render: (_, { product_info }) => priceFormatter(product_info.price),
    },
    {
      key: 'quantity',
      title: <TitleColumnTooltip title='SL đặt' tooltip='Số lượng đặt' />,
      dataIndex: 'purchase_quantity',
      align: 'right',
      width: '85px',
    },
    {
      key: 'quantity',
      title: <TitleColumnTooltip title='SLTT giao' tooltip='Số lượng thực tế giao' />,
      dataIndex: 'delivery_quantity',
      align: 'right',
      width: '105px',
      render: (value, { id, purchase_quantity }) =>
        openEditQuantity ? (
          <Form.Item
            name={id}
            rules={[
              { required: true, message: '' },
              { type: 'integer', message: '' },
            ]}
            style={{ marginBottom: 0 }}
          >
            <InputNumber size='small' min={0} style={{ width: 70 }} />
          </Form.Item>
        ) : (
          value ?? purchase_quantity
        ),
    },
    {
      key: 'amount',
      title: 'Thành tiền',
      align: 'right',
      width: '120px',
      render: (_, { purchase_quantity: quantity, delivery_quantity: quantity_update, product_info }) =>
        priceFormatter(product_info.price * (quantity_update ?? quantity)),
    },
  ];

  const ButtonAddProduct = allowEditProduct ? (
    <Button type='primary' icon={<PlusOutlined />} onClick={() => onChangeOpenAddProduct(true)}>
      Thêm sản phẩm
    </Button>
  ) : undefined;

  return (
    <SectionContent title='Danh sách sản phẩm' extra={ButtonAddProduct}>
      <ConfigProvider theme={{ token: { fontWeightStrong: 500 } }}>
        <Table
          size='middle'
          rowKey='id'
          columns={columns}
          dataSource={order?.order_products}
          pagination={false}
        />
      </ConfigProvider>
      <div style={{ marginTop: 10, padding: 8, textAlign: 'right' }}>
        <Typography.Text type='secondary'>Tổng tiền sản phẩm : </Typography.Text>
        <Typography.Text strong>{priceFormatter(order.amount)}</Typography.Text>
      </div>
    </SectionContent>
  );
};

export default OrderProductList;
