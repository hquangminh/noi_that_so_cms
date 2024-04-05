import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';

import dayjs from 'dayjs';
import { useMutation } from '@apollo/client';
import { EditOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Form, Input, List, Space, Typography } from 'antd';

import { handleErrorCatch } from 'lib/utils';
import { isArrayEmpty } from 'functions';
import { API_AddOrderNote, API_EditOrderNote } from 'graphql/order/mutation';

import { OrderContext } from './OrderProvider';

import { OrderNoteItem } from 'interface/Order';

const OrderNote = () => {
  const { order, updateOrder, apiNotification } = useContext(OrderContext);
  const [form] = Form.useForm();
  const [noteEdit, setNoteEdit] = useState<OrderNoteItem>();
  const [addNote, { loading }] = useMutation<{ insert_order_note_one: OrderNoteItem }>(API_AddOrderNote);

  const onSubmit = async ({ note }: Record<string, string>) => {
    await addNote({ variables: { data: { order_id: order.id, note } } })
      .then(({ data }) => {
        if (data)
          updateOrder((currentOrder) => ({
            ...currentOrder,
            order_notes: [...currentOrder.order_notes, ...[data.insert_order_note_one]],
          }));
        form.resetFields();
      })
      .catch((err) =>
        handleErrorCatch(err, () =>
          apiNotification.error({
            key: 'add-order-note-fail',
            message: 'Thêm ghi chú',
            description: 'Đã có lỗi xảy ra. Vui lòng thử lại sau.',
          }),
        ),
      );
  };

  return (
    <>
      {!isArrayEmpty(order.order_notes) && (
        <List
          style={{ marginBlockStart: 8 }}
          size='small'
          itemLayout='vertical'
          dataSource={order.order_notes}
          renderItem={(item) => <NoteItem data={item} dataEdit={noteEdit} onOpenEdit={setNoteEdit} />}
        />
      )}

      <Form form={form} onFinish={onSubmit} style={{ marginBlockStart: 18 }}>
        <ConfigProvider theme={{ token: { fontSize: 12 } }}>
          <Form.Item
            name='note'
            rules={[
              { required: true, message: 'Vui lòng nhập Ghi chú!' },
              { whitespace: true, message: 'Ghi chú không được chứa mỗi khoảng trắng' },
            ]}
            style={{ marginBlockEnd: 10 }}
          >
            <Input.TextArea autoSize={{ minRows: 2 }} placeholder='Thêm ghi chú' />
          </Form.Item>
        </ConfigProvider>

        <div style={{ textAlign: 'right' }}>
          <Button type='primary' htmlType='submit' loading={loading}>
            Lưu
          </Button>
        </div>
      </Form>
    </>
  );
};

export default OrderNote;

type NoteItemProps = {
  data: OrderNoteItem;
  dataEdit?: OrderNoteItem;
  onOpenEdit: Dispatch<SetStateAction<OrderNoteItem | undefined>>;
};
const NoteItem = ({ data, dataEdit, onOpenEdit }: NoteItemProps) => {
  const { updateOrder, apiNotification } = useContext(OrderContext);
  const [form] = Form.useForm();
  const [editNote, { loading }] = useMutation<{ update_order_note: { returning: [OrderNoteItem] } }>(
    API_EditOrderNote,
  );

  useEffect(() => {
    if (dataEdit) form.setFieldValue('note', dataEdit.note);
  }, [dataEdit, form]);

  const onEdit = async ({ note }: Record<string, string>) => {
    await editNote({ variables: { id: data.id, note } })
      .then(({ data }) => {
        if (data) {
          const note = data.update_order_note.returning[0];
          updateOrder((currentOrder) => ({
            ...currentOrder,
            order_notes: currentOrder.order_notes.map((i) => (i.id === note.id ? note : i)),
          }));
        }
        onOpenEdit(undefined);
      })
      .catch((err) =>
        handleErrorCatch(err, () =>
          apiNotification.error({
            key: 'edit-order-note-fail',
            message: 'Sửa ghi chú',
            description: 'Đã có lỗi xảy ra. Vui lòng thử lại sau.',
          }),
        ),
      );
  };

  const ButtonEdit = () => <Button size='small' icon={<EditOutlined />} onClick={() => onOpenEdit(data)} />;

  return (
    <List.Item extra={dataEdit?.id !== data.id ? <ButtonEdit /> : undefined} style={{ paddingInline: 0 }}>
      <ConfigProvider theme={{ token: { fontSize: 12 } }}>
        <Form form={form} onFinish={onEdit}>
          {dataEdit && dataEdit.id === data.id ? (
            <ConfigProvider theme={{ token: { fontSize: 12 } }}>
              <Form.Item
                name='note'
                rules={[
                  { required: true, message: 'Vui lòng nhập Ghi chú!' },
                  { whitespace: true, message: 'Ghi chú không được chứa mỗi khoảng trắng' },
                ]}
                style={{ marginBlockEnd: 10 }}
              >
                <Input.TextArea autoSize={{ minRows: 2 }} placeholder='Thêm ghi chú' />
              </Form.Item>

              <div style={{ textAlign: 'right' }}>
                <Space>
                  <Button type='primary' htmlType='submit' loading={loading}>
                    Lưu
                  </Button>
                  <Button disabled={loading} onClick={() => onOpenEdit(undefined)}>
                    Hủy
                  </Button>
                </Space>
              </div>
            </ConfigProvider>
          ) : (
            <Space direction='vertical' size={0} style={{ display: 'flex' }}>
              <Typography.Text style={{ whiteSpace: 'pre-line' }}>{data.note}</Typography.Text>
              <Typography.Text type='secondary'>
                Ngày tạo: {dayjs(data.created_at).format('HH:mm DD/MM/YYYY')}
              </Typography.Text>
              {data.updated_at && (
                <Typography.Text type='secondary'>
                  Ngày sửa: {dayjs(data.updated_at).format('HH:mm DD/MM/YYYY')}
                </Typography.Text>
              )}
            </Space>
          )}
        </Form>
      </ConfigProvider>
    </List.Item>
  );
};
