import { Fragment, useContext } from 'react';

import { useMutation } from '@apollo/client';
import { Button, Col, Form, Modal, Row, Space } from 'antd';

import { handleErrorCatch } from 'lib/utils';
import { API_UpdateOrderStatus } from 'graphql/order/mutation';

import SectionContent from 'components/Fragments/SectionContent';
import ModalCancelOrder from './CancelModal';
import { OrderContext } from './OrderProvider';

import { OrderActionName, OrderChangeLogItem, OrderDetail, OrderStatus, OrderTypeLog } from 'interface/Order';

type UpdateStatusResponse = {
  update_order: { returning: [OrderDetail] };
  insert_order_log_one: OrderChangeLogItem;
};

const OrderAction = () => {
  const [modal, modalContextHolder] = Modal.useModal();
  const form = Form.useFormInstance();

  const orderContext = useContext(OrderContext);
  const { order, updateOrder, allowEditProduct } = orderContext;
  const { openEditQuantity, onChangeOpenEditQuantity } = orderContext;
  const { actionProgress, apiNotification, onChangeOpenCancelOrder } = useContext(OrderContext);
  const { status: orderStatus } = order;

  const [updateOrderStatus] = useMutation<UpdateStatusResponse>(API_UpdateOrderStatus, {
    onCompleted: (data) =>
      updateOrder((currentData) => ({
        ...currentData,
        ...data.update_order.returning[0],
        order_logs: [...[data.insert_order_log_one], ...currentData.order_logs],
      })),
  });

  const handleEditQuantity = () => {
    const formValues = order?.order_products.reduce(
      (obj, { id, purchase_quantity: quantity, delivery_quantity: quantity_update }) => {
        return { ...obj, [id]: quantity_update ?? quantity };
      },
      {},
    );
    form.setFieldsValue(formValues);
    onChangeOpenEditQuantity(true);
  };

  const handleConfirmProcessing = () => {
    const modalConfirm = modal.confirm({
      title: 'Bạn có chắc muốn chuyển đơn hàng sang trạng thái Đang xử lý?',
      autoFocusButton: null,
      onOk: async () =>
        await Promise.all([
          modalConfirm.update({ cancelButtonProps: { disabled: true } }),
          updateOrderStatus({
            variables: {
              orderID: order.id,
              status: OrderStatus.PROCESSING,
              log: { order_id: order.id, type: OrderTypeLog.PROCESSING },
            },
          }),
        ])
          .then(() =>
            apiNotification.success({
              key: 'update-order-success',
              message: 'Cập nhật đơn hàng',
              description: 'Đơn hàng đã chuyển sang trạng thái Đang xử lý',
            }),
          )
          .catch((error) => handleErrorCatch(error)),
    });
  };

  const handleConfirmPreparing = () => {
    const modalConfirm = modal.confirm({
      title: 'Bạn có chắc muốn chuyển đơn hàng sang trạng thái Chuẩn bị hàng?',
      autoFocusButton: null,
      onOk: async () =>
        await Promise.all([
          modalConfirm.update({ cancelButtonProps: { disabled: true } }),
          updateOrderStatus({
            variables: {
              orderID: order.id,
              status: OrderStatus.PREPARING,
              log: { order_id: order.id, type: OrderTypeLog.PREPARING },
            },
          }),
        ])
          .then(() =>
            apiNotification.success({
              key: 'update-order-success',
              message: 'Cập nhật đơn hàng',
              description: 'Đơn hàng đã chuyển sang trạng thái Chuẩn bị hàng',
            }),
          )
          .catch((error) => handleErrorCatch(error)),
    });
  };

  const handleConfirmShipping = () => {
    const modalConfirm = modal.confirm({
      title: 'Bạn có chắc muốn chuyển đơn hàng sang trạng thái Đang vận chuyển?',
      autoFocusButton: null,
      onOk: async () =>
        await Promise.all([
          modalConfirm.update({ cancelButtonProps: { disabled: true } }),
          updateOrderStatus({
            variables: {
              orderID: order.id,
              status: OrderStatus.SHIPPING,
              log: { order_id: order.id, type: OrderTypeLog.SHIPPING },
            },
          }),
        ])
          .then(() =>
            apiNotification.success({
              key: 'update-order-success',
              message: 'Cập nhật đơn hàng',
              description: 'Đơn hàng đã chuyển sang trạng thái Đang vận chuyển',
            }),
          )
          .catch((error) => handleErrorCatch(error)),
    });
  };

  const handleConfirmSuccess = () => {
    const modalConfirm = modal.confirm({
      title: 'Bạn có chắc muốn chuyển đơn hàng sang trạng thái Đã hoàn thành?',
      autoFocusButton: null,
      onOk: async () =>
        await Promise.all([
          modalConfirm.update({ cancelButtonProps: { disabled: true } }),
          updateOrderStatus({
            variables: {
              orderID: order.id,
              status: OrderStatus.SUCCESS,
              log: { order_id: order.id, type: OrderTypeLog.SUCCESS },
            },
          }),
        ])
          .then(() =>
            apiNotification.success({
              key: 'update-order-success',
              message: 'Cập nhật đơn hàng',
              description: 'Đơn hàng đã chuyển sang trạng thái Đã hoàn thành',
            }),
          )
          .catch((error) => handleErrorCatch(error)),
    });
  };

  return (
    <Fragment>
      {modalContextHolder}

      <SectionContent fixedBottom size='small'>
        <Row justify='space-between'>
          <Col>
            {allowEditProduct && (
              <>
                {!openEditQuantity ? (
                  <Button type='primary' ghost onClick={handleEditQuantity}>
                    Cập nhật đơn hàng
                  </Button>
                ) : (
                  <Space>
                    <Button type='primary' ghost onClick={() => onChangeOpenEditQuantity(false)}>
                      Hủy
                    </Button>
                    <Button
                      type='primary'
                      loading={actionProgress === OrderActionName.CHANGE_QUANTITY}
                      onClick={form.submit}
                    >
                      Cập nhật
                    </Button>
                  </Space>
                )}
              </>
            )}
          </Col>
          <Col>
            <Space>
              {orderStatus === OrderStatus.NEW && (
                <Button type='primary' onClick={handleConfirmProcessing}>
                  Tiến hành xử lý
                </Button>
              )}

              {orderStatus === OrderStatus.PROCESSING && (
                <Button type='primary' disabled={openEditQuantity} onClick={handleConfirmPreparing}>
                  Chuẩn bị hàng
                </Button>
              )}

              {orderStatus === OrderStatus.PREPARING && (
                <Button type='primary' onClick={handleConfirmShipping}>
                  Gửi hàng
                </Button>
              )}

              {orderStatus === OrderStatus.SHIPPING && (
                <Button type='primary' onClick={handleConfirmSuccess}>
                  Đơn hàng đã hoàn thành
                </Button>
              )}

              {orderStatus !== OrderStatus.SUCCESS && (
                <>
                  <Button
                    type='primary'
                    danger
                    disabled={openEditQuantity}
                    onClick={() => onChangeOpenCancelOrder(true)}
                  >
                    Hủy đơn hàng
                  </Button>
                  <ModalCancelOrder />
                </>
              )}
            </Space>
          </Col>
        </Row>
      </SectionContent>
    </Fragment>
  );
};

export default OrderAction;
