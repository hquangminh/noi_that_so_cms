import { useContext, useState } from 'react';

import { AxiosError } from 'axios';
import { DeleteOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  ConfigProvider,
  Descriptions,
  Form,
  InputNumber,
  Modal,
  ModalProps,
  Row,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import { ColumnsType } from 'antd/es/table';

import { handleErrorCatch } from 'lib/utils';
import { isArrayEmpty, priceFormatter } from 'functions';
import orderServices from 'services/order';

import OrderSearchProduct from './SearchProduct';
import { OrderContext } from './OrderProvider';

import { ProductType, ProductVariationType } from 'interface/Product';
import { OrderProductItem } from 'interface/Order';

import { TextLineClamp } from 'lib/styles';
import { MaxIntegerPostgreSQL } from 'common/constants';

const OrderAddProduct = () => {
  const [form] = Form.useForm();
  const [modal, contextHolder] = Modal.useModal();
  const [selected, setSelected] = useState<ProductType[]>([]);

  const { order, updateOrder, apiNotification, openAddProduct, onChangeOpenAddProduct } =
    useContext(OrderContext);

  const onAddProduct = async (productsQuantity: Record<string, number>) => {
    try {
      const products: Omit<OrderProductItem, 'id' | 'product'>[] = selected.map((prod) => {
        const { id: product_id, product_variations } = prod;
        const { id: variation_id, combName, promotion_price: price } = product_variations[0];
        return {
          product_id,
          variation_id,
          purchase_quantity: productsQuantity[product_id + '-' + variation_id],
          delivery_quantity: productsQuantity[product_id + '-' + variation_id],
          product_info: { name: prod.name, image: prod.image, price, variation: combName ?? null },
        };
      });

      const { data } = await orderServices.addProduct({ order_id: order.id, products });
      updateOrder((currentOrder) => ({ ...currentOrder, ...data }));
      onChangeOpenAddProduct(false);
      apiNotification.success({
        key: 'add-product-order-success',
        message: 'Thêm sản phẩm',
        description: 'Đã thêm sản phẩm thành công',
      });
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data.error_code === 'INVALID_PRODUCT') {
        const products: OrderProductItem[] = error.response.data.invalid_products;
        apiNotification.error({
          key: 'add-product-order-fail',
          message: 'Thêm sản phẩm thất bại',
          description: 'Có sản phẩm không hợp lệ, vui lòng kiểm tra lại kho hoặc giá của sản phẩm.',
        });
        form.setFields(
          products.map(({ product_id, variation_id }) => ({
            name: product_id + '-' + variation_id,
            errors: [''],
          })),
        );
      } else
        handleErrorCatch(error, () =>
          apiNotification.error({
            key: 'add-product-order-fail',
            message: 'Cập nhật đơn hàng',
            description: 'Thêm sản phẩm thất bại. Vui lòng thử lại sau.',
          }),
        );
    }
  };

  const onConfirmAddProduct = (values: Record<string, number>) => {
    const modalConfirm = modal.confirm({
      title: 'Bạn có chắc muốn thêm sản phẩm cho đơn hàng?',
      content: 'Sau khi thêm sản phẩm bạn sẽ không thể thay đổi.',
      onOk: async () =>
        Promise.all([modalConfirm.update({ cancelButtonProps: { disabled: true } }), onAddProduct(values)]),
    });
  };

  const modalProps: ModalProps = {
    title: 'Thêm sản phẩm cho đơn hàng',
    open: openAddProduct,
    width: 800,
    centered: true,
    closable: false,
    destroyOnClose: true,
    okText: 'Xác nhận',
    okButtonProps: { disabled: isArrayEmpty(selected) },
    onCancel: () => onChangeOpenAddProduct(false),
    onOk: form.submit,
    afterOpenChange: () => {
      setSelected([]);
      form.resetFields();
    },
  };

  const columns: ColumnsType<ProductType> = [
    { key: 'index', title: 'STT', align: 'right', width: '50px', render: (_, __, index) => index + 1 },
    {
      key: 'info',
      title: 'Sản phẩm',
      render: (_, { image, name, product_variations, partner }) => (
        <Row gutter={16} wrap={false} align='stretch'>
          <Col>
            <img src={image} alt='' width='50' height='50' style={{ objectFit: 'contain' }} />
          </Col>
          <Col flex='auto' style={{ alignSelf: 'center' }}>
            <TextLineClamp style={{ marginBottom: 0, fontWeight: 500 }}>{name}</TextLineClamp>
            <ConfigProvider theme={{ components: { Descriptions: { itemPaddingBottom: 0 } } }}>
              <Descriptions column={1}>
                {product_variations[0].type === ProductVariationType.ByOption && (
                  <Descriptions.Item label='Phân loại'>{product_variations[0].combName}</Descriptions.Item>
                )}
                {partner && <Descriptions.Item label='Đối tác'>{partner.name}</Descriptions.Item>}
              </Descriptions>
            </ConfigProvider>
          </Col>
        </Row>
      ),
    },
    {
      key: 'price',
      title: 'Giá',
      align: 'right',
      width: '120px',
      render: (_, { product_variations }) =>
        priceFormatter(product_variations[0].promotion_price ?? product_variations[0].price),
    },
    {
      title: 'Kho hàng',
      key: 'stock',
      align: 'center',
      width: '100px',
      render: (_, { preparation_time, product_variations }) =>
        preparation_time ? <Tag color='processing'>Đặt trước</Tag> : product_variations[0].stock,
    },
    {
      key: 'quantity',
      title: 'Số lượng',
      dataIndex: 'quantity_update',
      align: 'right',
      width: '105px',
      render: (_, { id, preparation_time, product_variations }) => (
        <Form.Item
          name={id + '-' + product_variations[0].id}
          preserve={false}
          rules={[
            { required: true, message: '' },
            { type: 'integer', message: '' },
          ]}
          style={{ marginBottom: 0 }}
        >
          <InputNumber
            size='small'
            min={0}
            max={preparation_time ? MaxIntegerPostgreSQL : product_variations[0].stock}
            style={{ width: 70 }}
          />
        </Form.Item>
      ),
    },
    {
      title: 'Xóa',
      key: 'remove',
      align: 'center',
      width: '50px',
      render: (_, { id, product_variations }) => {
        const onRemove = () =>
          setSelected((selectCurrent) =>
            selectCurrent.filter(
              (i) => !(i.id === id && i.product_variations[0].id === product_variations[0].id),
            ),
          );
        return <Button size='small' danger icon={<DeleteOutlined />} onClick={onRemove} />;
      },
    },
  ];

  return (
    <>
      {contextHolder}

      <Modal {...modalProps}>
        <OrderSearchProduct selected={selected} onSelectProduct={setSelected} />

        <Form
          form={form}
          onFinish={onConfirmAddProduct}
          onFinishFailed={() => message.error('Vui lòng nhập số lượng hợp lệ cho sản phẩm')}
          style={{ marginBlockStart: 24 }}
        >
          <Typography.Text type='secondary' style={{ display: 'block', marginBlockEnd: 16 }}>
            Tổng <Typography.Text>{selected.length}</Typography.Text> sản phẩm được chọn
          </Typography.Text>
          <Table
            rowKey={(record) => record.id + '_' + record.product_variations[0].id}
            columns={columns}
            dataSource={selected}
            pagination={false}
          />
        </Form>
      </Modal>
    </>
  );
};

export default OrderAddProduct;
