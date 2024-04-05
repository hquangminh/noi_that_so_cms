import { useContext, useState } from 'react';
import { Divider, Form, Input, Modal, ModalProps, Typography } from 'antd';

import { handleErrorCatch } from 'lib/utils';
import orderServices from 'services/order';

import { OrderContext } from './OrderProvider';

const ModalCancelOrder = () => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { order, updateOrder, openCancelOrder, onChangeOpenCancelOrder, apiNotification } =
    useContext(OrderContext);

  const onSubmit = async (values: { note: string }) => {
    try {
      setSubmitting(true);
      const { data } = await orderServices.cancel({ ...values, order_id: order.id });
      if (data)
        updateOrder((currentData) => ({
          ...currentData,
          ...data.update_order.returning[0],
          order_logs: [...[data.insert_order_log_one], ...currentData.order_logs],
        }));
      apiNotification.success({
        key: 'cancel-order-success',
        message: 'Cập nhật đơn hàng',
        description: 'Đã hủy đơn hàng thành công',
      });
      onChangeOpenCancelOrder(false);
    } catch (error) {
      setSubmitting(false);
      handleErrorCatch(error);
    }
  };

  const modalProps: ModalProps = {
    title: 'Bạn có chắc muốn hủy đơn hàng này?',
    open: openCancelOrder,
    closable: false,
    destroyOnClose: true,
    cancelButtonProps: { disabled: submitting },
    okButtonProps: { loading: submitting },
    onCancel: () => onChangeOpenCancelOrder(false),
    onOk: form.submit,
    afterClose: form.resetFields,
  };

  return (
    <Modal {...modalProps}>
      <Typography.Text type='warning'>Sau khi hủy đơn hàng bạn sẽ không thể khôi phục.</Typography.Text>
      <Divider />
      <Form form={form} layout='vertical' onFinish={onSubmit}>
        <Form.Item name='note' label='Lý do hủy đơn' rules={[{ required: true }]}>
          <Input.TextArea placeholder='Nhập lý do khiến đơn hàng bị hủy' />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalCancelOrder;
