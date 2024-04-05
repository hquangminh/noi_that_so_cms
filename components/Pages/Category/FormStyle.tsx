import { useEffect, useRef, useState } from 'react';

import { useLazyQuery, useMutation } from '@apollo/client';
import { Button, Form, Input, InputRef, Modal, ModalProps, Space, Switch, notification } from 'antd';

import { handleErrorCatch } from 'lib/utils';
import { removeSpaceString } from 'functions';
import { API_CountStyleOutstanding } from 'graphql/category/query';
import { API_AddStyleType, API_EditStyleType } from 'graphql/category/mutation';
import globalServices from 'services/global-service';

import * as handleNotification from './Notification';
import CategoryAlreadyExist from 'components/Fragments/CategoryAlreadyExist';

import { CategoryStyleType } from 'interface/Category';
import { AggregateCount, GraphQlAggregate } from 'interface/Global';

type Props = {
  type: FormStyleCategoryType;
  data?: CategoryStyleType;
  onClose: () => void;
  onSuccess: () => void;
};
export type FormStyleCategoryType = 'add' | 'edit' | 'close';

const FormStyleCategory = ({ type, data, onClose, onSuccess }: Props) => {
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  const [submitting, setSubmitting] = useState<boolean>(false);
  const inputRef = useRef<InputRef>(null);

  const [addRoom] = useMutation(API_AddStyleType);
  const [editRoom] = useMutation(API_EditStyleType);
  const [countOutstanding] = useLazyQuery<{ style_type_aggregate: GraphQlAggregate<AggregateCount> }>(
    API_CountStyleOutstanding,
    { fetchPolicy: 'network-only' },
  );

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [type]);

  useEffect(() => {
    if (type === 'edit' && data) form.setFieldsValue(data);
    else form.resetFields();
  }, [type, data, form]);

  const onSubmit = async ({ name: nameField, outstanding }: { name: string; outstanding: boolean }) => {
    try {
      setSubmitting(true);

      if (outstanding) {
        const totalOutstanding = await countOutstanding({ variables: { non_id: data?.id } });
        if (totalOutstanding.data && totalOutstanding.data.style_type_aggregate.aggregate.count >= 5) {
          api.error({
            message: 'Không thể thực hiện',
            description: 'Chỉ có thể chọn tối đa 5 mục nổi bật. Vui lòng kiểm tra và thử lại.',
          });
          setSubmitting(false);
          return;
        }
      }

      const params = { id: data?.id, name: nameField, table: 'style-category' };
      const { exist } = await globalServices.checkItemExist(params);

      if (!exist) {
        const name = removeSpaceString(nameField);
        if (type === 'add') {
          await addRoom({ variables: { data: { name, outstanding } } });
          handleNotification.AddStyleTypeSuccess();
        }
        if (type === 'edit') {
          await editRoom({ variables: { id: data?.id, data: { name, outstanding } } });
          handleNotification.EditStyleTypeSuccess();
        }
        onClose();
        onSuccess();
      } else CategoryAlreadyExist();

      setSubmitting(false);
    } catch (error) {
      setSubmitting(false);
      handleErrorCatch(
        error,
        type === 'add' ? handleNotification.AddStyleTypeFail : handleNotification.EditStyleTypeFail,
      );
    }
  };

  const onReset = () => {
    if (inputRef.current?.input?.value) form.resetFields();
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const modalProps: ModalProps = {
    title: `${type === 'add' ? 'Tạo' : 'Chỉnh sửa'} phong cách`,
    open: type !== 'close',
    footer: null,
    closable: !submitting,
    destroyOnClose: true,
    onCancel: onClose,
  };

  return (
    <Modal {...modalProps}>
      {contextHolder}

      <Form form={form} labelCol={{ flex: '120px' }} style={{ marginTop: 30 }} onFinish={onSubmit}>
        <Form.Item
          name='name'
          label='Tên phong cách'
          required={false}
          rules={[
            { required: true, message: 'Vui lòng nhập ${label}' },
            { whitespace: true, message: '${label} không thể chứa mỗi khoảng trắng' },
          ]}
        >
          <Input ref={inputRef} autoComplete='off' maxLength={50} showCount />
        </Form.Item>

        <Form.Item name='outstanding' label='Nổi bật' valuePropName='checked'>
          <Switch />
        </Form.Item>

        <div style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={onReset} disabled={submitting}>
              Đặt lại
            </Button>
            <Button type='primary' htmlType='submit' loading={submitting}>
              {type === 'add' ? 'Tạo' : 'Lưu'}
            </Button>
          </Space>
        </div>
      </Form>
    </Modal>
  );
};

export default FormStyleCategory;
