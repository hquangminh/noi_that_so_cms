import { useEffect, useRef, useState } from 'react';

import { useLazyQuery, useMutation } from '@apollo/client';
import { Button, Form, Input, InputRef, Modal, ModalProps, Select, Space, Switch, notification } from 'antd';

import { handleErrorCatch } from 'lib/utils';
import { removeSpaceString } from 'functions';
import { API_CheckProductCategoryIsParent } from 'graphql/category/query';
import { API_AddProductCategory, API_EditProductCategory } from 'graphql/category/mutation';
import globalServices from 'services/global-service';

import * as handleNotification from './Notification';
import CategoryAlreadyExist from 'components/Fragments/CategoryAlreadyExist';

import { AggregateCount, GraphQlAggregate } from 'interface/Global';
import { CategoryProductType } from 'interface/Category';

type Props = {
  type: FormProductCategoryType;
  categories?: CategoryProductType[];
  data?: CategoryProductType;
  isSingle?: boolean;
  onClose: () => void;
  onSuccess: () => void;
};
export type FormProductCategoryType = 'add' | 'edit' | 'close';

const FormProductCategory = ({ type, categories, data, isSingle, onClose, onSuccess }: Props) => {
  const [form] = Form.useForm();
  const [apiNotification, contextNotification] = notification.useNotification();

  const [submitting, setSubmitting] = useState<boolean>(false);
  const inputRef = useRef<InputRef>(null);

  const isParent = data && categories?.some((i) => i.id === data.id);

  const [checkCategoryIsParent] = useLazyQuery<{
    product_category: [{ product_category_relations_aggregate: GraphQlAggregate<AggregateCount> }];
  }>(API_CheckProductCategoryIsParent);
  const [addProductCategory] = useMutation(API_AddProductCategory);
  const [editProductCategory] = useMutation(API_EditProductCategory);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [type]);

  useEffect(() => {
    if (type === 'edit' && data) form.setFieldsValue(data);
    else form.resetFields();
  }, [type, data, form]);

  const onSubmit = async (values: any) => {
    try {
      setSubmitting(true);

      const { parent_id = null, status } = values;

      if (parent_id) {
        const { data } = await checkCategoryIsParent({ variables: { id: parent_id } });
        if (data && data.product_category[0].product_category_relations_aggregate.aggregate.count > 0) {
          setSubmitting(false);
          return apiNotification.error({
            key: 'add-update-category-fail',
            message: 'Thao tác thất bại',
            description:
              'Không thể chọn danh mục đã được sử dụng làm danh mục cha. Vui lòng tải lại trang và thử lại.',
          });
        }
      }

      const params = { id: data?.id, name: values.name, table: 'product-category' };
      const { exist } = await globalServices.checkItemExist(params);

      if (exist === false) {
        const name = removeSpaceString(values.name);
        const body = { name: removeSpaceString(name), parent_id, status };
        if (type === 'add') {
          await addProductCategory({ variables: { objects: body } });
          handleNotification.AddProductCategorySuccess();
        }
        if (type === 'edit') {
          await editProductCategory({ variables: { id: data?.id, _set: body, _setChild: { status } } });
          handleNotification.EditProductCategorySuccess();
        }
        onClose();
        onSuccess();
      } else CategoryAlreadyExist();

      setSubmitting(false);
    } catch (error) {
      setSubmitting(false);
      handleErrorCatch(
        error,
        type === 'add'
          ? handleNotification.AddProductCategoryFail
          : handleNotification.EditProductCategoryFail,
      );
    }
  };

  const onReset = () => {
    if (inputRef.current?.input?.value) form.resetFields();
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const modalProps: ModalProps = {
    title: (
      <div style={{ textAlign: 'center' }}>{type === 'add' ? 'Tạo' : 'Chỉnh sửa'} danh mục sản phẩm</div>
    ),
    open: type !== 'close',
    footer: null,
    closable: !submitting,
    destroyOnClose: true,
    onCancel: onClose,
  };

  return (
    <Modal {...modalProps}>
      {contextNotification}

      <Form form={form} layout='vertical' style={{ marginTop: 10 }} onFinish={onSubmit}>
        <Form.Item
          name='name'
          label='Tên danh mục'
          required={false}
          rules={[
            { required: true, message: 'Vui lòng nhập ${label}' },
            { whitespace: true, message: '${label} không thể chứa mỗi khoảng trắng' },
          ]}
        >
          <Input ref={inputRef} autoComplete='off' maxLength={50} showCount />
        </Form.Item>

        {(!isParent || isSingle) && (
          <Form.Item name='parent_id' label='Danh mục cha'>
            <Select
              allowClear
              options={categories
                ?.filter((i) => i.id !== data?.id)
                .map((i) => ({ label: i.name, value: i.id }))}
            />
          </Form.Item>
        )}

        <Form.Item name='status' label='Kích hoạt' valuePropName='checked'>
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

export default FormProductCategory;
