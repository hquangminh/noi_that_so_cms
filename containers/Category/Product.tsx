import { useState } from 'react';

import { useMutation, useQuery } from '@apollo/client';
import { CheckCircleTwoTone, CloseCircleTwoTone, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Modal, Row, Space, Table, Typography, notification, theme } from 'antd';
import { ColumnsType } from 'antd/es/table';

import { isArrayEmpty } from 'functions';
import { handleErrorCatch } from 'lib/utils';
import { API_GetProductCategory } from 'graphql/category/query';
import { API_DeleteProductCategory } from 'graphql/category/mutation';

import SectionContent from 'components/Fragments/SectionContent';
import FormProductCategory, { FormProductCategoryType } from 'components/Pages/Category/FormProduct';

import { CategoryProductType } from 'interface/Category';

type DataType = CategoryProductType & { children?: DataType[] };

const ProductCategoryContainer = () => {
  const { token } = theme.useToken();
  const [modal, contextModal] = Modal.useModal();
  const [apiNotification, contextNotification] = notification.useNotification();

  const [formType, setFormType] = useState<FormProductCategoryType>('close');
  const [categoryEdit, setCategoryEdit] = useState<CategoryProductType>();

  const { loading, data, refetch } = useQuery<{ product_category: CategoryProductType[] }>(
    API_GetProductCategory,
    { fetchPolicy: 'network-only', notifyOnNetworkStatusChange: true },
  );
  const [deleteMateria] = useMutation(API_DeleteProductCategory);

  const categories: DataType[] | undefined = data?.product_category
    .filter((i) => !i.parent_id)
    .map((i) => {
      const children = data.product_category.filter((x) => x.parent_id === i.id);
      return { ...i, children: children.length > 0 ? children : undefined };
    });

  const onOpenEdit = (data: CategoryProductType) => {
    setCategoryEdit(data);
    setFormType('edit');
  };

  const handleDelete = async (id: number) => {
    await deleteMateria({ variables: { id } })
      .then(() => {
        refetch();
        apiNotification.success({
          key: 'delete-product-category-success',
          message: 'Đã xóa danh mục thành công',
        });
      })
      .catch((err) =>
        handleErrorCatch(err, () =>
          apiNotification.error({
            key: 'delete-product-category-fail',
            message: 'Xóa danh mục thất bại',
            description: 'Đã có lỗi xảy ra. Vui lòng thử lại sau hoặc liên hệ nhóm phát triển.',
          }),
        ),
      );
  };

  const handleConfirmDelete = (id: number, used: boolean, isParent: boolean) => {
    if (used)
      return apiNotification.error({
        key: 'cannot-delete-category-used',
        message: 'Không thể xóa danh mục',
        description: 'Không thể xóa danh mục sản phẩm đang được sử dụng',
      });
    else if (isParent)
      return apiNotification.error({
        key: 'cannot-delete-parent-category',
        message: 'Không thể xóa danh mục',
        description: 'Bạn phải xóa tất cả danh mục con trước tiên',
      });

    const modalConfirm = modal.confirm({
      title: 'Bạn có chắc muốn xóa danh mục này?',
      cancelText: 'Hủy',
      okText: 'Xác nhận',
      onOk: async () =>
        await Promise.all([modalConfirm.update({ cancelButtonProps: { disabled: true } }), handleDelete(id)]),
    });
  };

  const columns: ColumnsType<DataType> = [
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Tổng sản phẩm',
      key: 'total-products',
      align: 'center',
      render: (_, record) => {
        const childrenProductTotal = record.children
          ? record.children.reduce((count, { product_category_relations_aggregate }) => {
              return count + product_category_relations_aggregate.aggregate.count;
            }, 0)
          : null;
        return childrenProductTotal ?? record.product_category_relations_aggregate.aggregate.count;
      },
    },
    {
      title: 'Xuất bản',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: '100px',
      render: (value) =>
        value ? (
          <CheckCircleTwoTone twoToneColor='#52c41a' />
        ) : (
          <CloseCircleTwoTone twoToneColor={token.colorError} />
        ),
    },
    {
      title: 'Thao tác',
      dataIndex: 'actions',
      key: 'actions',
      align: 'center',
      render: (_, record) => {
        const used = record.product_category_relations_aggregate.aggregate.count > 0,
          isParent = !isArrayEmpty(record.children);
        return (
          <Space split={<Divider type='vertical' />}>
            <a onClick={() => onOpenEdit(record)}>
              <Typography.Text type='warning'>Sửa</Typography.Text>
            </a>
            <a onClick={() => handleConfirmDelete(record.id, used, isParent)}>
              <Typography.Text type='danger'>Xóa</Typography.Text>
            </a>
          </Space>
        );
      },
    },
  ];

  return (
    <SectionContent>
      <Row gutter={[0, 24]} justify='end'>
        <Col flex='none'>
          <Button type='primary' icon={<PlusOutlined />} onClick={() => setFormType('add')}>
            Thêm danh mục
          </Button>
        </Col>

        <Col span={24}>
          <Table
            rowKey='id'
            loading={loading}
            columns={columns}
            dataSource={categories}
            expandable={{
              expandIcon: undefined,
              fixed: 'right',
              rowExpandable: (record) => typeof record.children !== 'undefined',
            }}
          />
        </Col>
      </Row>

      <FormProductCategory
        type={formType}
        categories={data?.product_category.filter(
          (i) => !i.parent_id && !i.product_category_relations_aggregate.aggregate.count,
        )}
        data={categoryEdit}
        isSingle={!data?.product_category.some((i) => i.parent_id === categoryEdit?.id)}
        onClose={() => {
          setFormType('close');
          setCategoryEdit(undefined);
        }}
        onSuccess={refetch}
      />

      {contextModal}
      {contextNotification}
    </SectionContent>
  );
};

export default ProductCategoryContainer;
