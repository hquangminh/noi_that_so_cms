import { useEffect, useRef, useState } from 'react';

import { useMutation } from '@apollo/client';
import { Button, Form, Input, InputRef, Modal, ModalProps, Space, Switch } from 'antd';

import { handleErrorCatch } from 'lib/utils';
import { removeSpaceString } from 'functions';
import { API_AddBlogCategory, API_EditBlogCategory } from 'graphql/blog/mutation';
import globalServices from 'services/global-service';

import * as handleNotification from './Notification';
import CategoryAlreadyExist from 'components/Fragments/CategoryAlreadyExist';

import { BlogCategory } from 'interface/Blog';

type Props = {
  type: FormBlogCategoryType;
  data?: BlogCategory;
  onClose: () => void;
  onSuccess: () => void;
};
export type FormBlogCategoryType = 'add' | 'edit' | 'close';

const FormBlogCategory = ({ type, data, onClose, onSuccess }: Props) => {
  const [form] = Form.useForm();

  const [submitting, setSubmitting] = useState<boolean>(false);
  const inputRef = useRef<InputRef>(null);

  const [addProductCategory] = useMutation(API_AddBlogCategory);
  const [editProductCategory] = useMutation(API_EditBlogCategory);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [type]);

  useEffect(() => {
    if (type === 'edit' && data) form.setFieldsValue(data);
    else form.resetFields();
  }, [type, data, form]);

  const onSubmit = async (values: { name: string; status: boolean | undefined }) => {
    try {
      setSubmitting(true);

      const params = { id: data?.id, name: values.name, table: 'blog-category' };
      const { exist } = await globalServices.checkItemExist(params);

      if (!exist) {
        const body = { ...values, name: removeSpaceString(values.name) };
        if (type === 'add') {
          await addProductCategory({ variables: { objects: body } });
          handleNotification.AddBlogCategorySuccess();
        }
        if (type === 'edit') {
          const { status } = values;
          await editProductCategory({
            variables: { id: data?.id, set: body, update_blog: !status ? { status } : undefined },
          });
          handleNotification.EditBlogCategorySuccess();
        }
        onClose();
        onSuccess();
      } else CategoryAlreadyExist();

      setSubmitting(false);
    } catch (error) {
      setSubmitting(false);
      handleErrorCatch(
        error,
        type === 'add' ? handleNotification.AddBlogCategoryFail : handleNotification.EditBlogCategoryFail,
      );
    }
  };

  const onReset = () => {
    if (inputRef.current?.input?.value) form.resetFields();
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const modalProps: ModalProps = {
    title: <div style={{ textAlign: 'center' }}>{type === 'add' ? 'Tạo' : 'Chỉnh sửa'} danh mục Blog</div>,
    open: type !== 'close',
    footer: null,
    closable: !submitting,
    destroyOnClose: true,
    onCancel: onClose,
  };

  return (
    <Modal {...modalProps}>
      <Form
        form={form}
        labelCol={{ flex: '105px' }}
        wrapperCol={{ span: 24 }}
        style={{ marginTop: 20 }}
        onFinish={onSubmit}
      >
        <Form.Item
          name='name'
          label='Tên danh mục'
          required={false}
          rules={[
            { required: true, message: 'Vui lòng nhập ${label}!' },
            { whitespace: true, message: '${label} không được chứa mỗi khoảng trắng' },
          ]}
        >
          <Input ref={inputRef} autoComplete='off' maxLength={50} showCount />
        </Form.Item>

        <Form.Item name='status' label='Kích hoạt'>
          <Switch defaultChecked={type === 'edit' ? data?.status : false} />
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

export default FormBlogCategory;
