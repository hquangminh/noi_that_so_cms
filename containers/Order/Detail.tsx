import { Fragment, useContext } from 'react';

import { AxiosError } from 'axios';
import { Col, Form, Row, Tabs } from 'antd';

import { handleErrorCatch } from 'lib/utils';
import orderServices from 'services/order';

import { OrderContext } from 'components/Pages/Order/OrderProvider';
import OrderAction from 'components/Pages/Order/OrderAction';
import OrderAddProduct from 'components/Pages/Order/AddProduct';
import OrderInformation from 'components/Pages/Order/OrderInformation';
import OrderNote from 'components/Pages/Order/OrderNote';
import OrderProductList from 'components/Pages/Order/OrderProductList';
import OrderTimeline from 'components/Pages/Order/OrderTimeline';

import { OrderActionName, OrderProductItem, OrderStatus } from 'interface/Order';

const OrderDetailContainer = () => {
  const [form] = Form.useForm();

  const {
    order,
    updateOrder,
    onChangeOpenEditQuantity,
    onChangeActionProgress,
    allowEditProduct,
    apiNotification,
  } = useContext(OrderContext);

  const onSubmitEdit = async (values: Record<string, any>) => {
    try {
      onChangeActionProgress(OrderActionName.CHANGE_QUANTITY);
      const products = order.order_products.map(({ id }) => ({ id, quantity: values[id] }));

      const { data } = await orderServices.updateProductQuantity({ order_id: order.id, products });
      if (data) updateOrder((currentOrder) => ({ ...currentOrder, ...data.update_order.returning[0] }));

      apiNotification.success({
        key: 'update-order-success',
        message: 'Cập nhật đơn hàng',
        description: 'Đã cập nhật số lượng sản phẩm thành công',
      });

      onChangeOpenEditQuantity(false);
      onChangeActionProgress(null);
    } catch (error) {
      onChangeActionProgress(null);
      if (
        error instanceof AxiosError &&
        error.response?.data.error_code === 'ORDER_UPDATE_QUANTITY_INVALID_PRODUCT'
      ) {
        const products: OrderProductItem[] = error.response.data.invalid_products;
        apiNotification.error({
          key: 'update-order-fail',
          message: 'Cập nhật đơn hàng',
          description: 'Cập nhật đơn hàng thất bại vì có sản phẩm không đủ tồn kho.',
        });
        form.setFields(products.map(({ id }) => ({ name: id, errors: [''] })));
      } else
        handleErrorCatch(error, () =>
          apiNotification.error({
            key: 'update-order-fail',
            message: 'Cập nhật đơn hàng',
            description: 'Cập nhật đơn hàng thất bại. Vui lòng thử lại sau.',
          }),
        );
    }
  };

  return (
    <Fragment>
      <Row gutter={[20, 0]}>
        <Col flex='calc(100% - 320px)'>
          <Form form={form} onFinish={onSubmitEdit}>
            <OrderInformation />
            <OrderProductList />
            {order.status !== OrderStatus.CANCEL && <OrderAction />}
          </Form>
        </Col>
        <Col flex='320px'>
          <div style={{ position: 'sticky', top: 30 }}>
            <Tabs
              size='small'
              items={[
                { key: 'change-logs', label: 'Lịch sử', children: <OrderTimeline /> },
                { key: 'notes', label: 'Ghi chú', children: <OrderNote /> },
              ]}
            />
          </div>
        </Col>
      </Row>

      {/* Modal */}
      {allowEditProduct && <OrderAddProduct />}
    </Fragment>
  );
};

export default OrderDetailContainer;
