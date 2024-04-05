import { useState } from 'react';

import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { PlusOutlined, CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
import { Button, Col, Divider, Modal, Row, Space, Table, Typography, theme } from 'antd';
import { ColumnsType } from 'antd/es/table';

import { handleErrorCatch } from 'lib/utils';
import { API_CountBlogByCategory, API_GetBlogCategory } from 'graphql/blog/query';
import { API_DeleteBlogCategory } from 'graphql/blog/mutation';

import SectionContent from 'components/Fragments/SectionContent';
import PaginationShowTotal from 'components/Fragments/PaginationShowTotal';
import FormBlogCategory, { FormBlogCategoryType } from 'components/Pages/Blogs/FormCategory';
import * as handleNotification from 'components/Pages/Blogs/Notification';

import { BlogCategory } from 'interface/Blog';

const BlogCategoryContainer = () => {
  const [modal, contextHolder] = Modal.useModal();
  const { token } = theme.useToken();

  const [categories, setCategory] = useState<BlogCategory[]>();
  const [formType, setFormType] = useState<FormBlogCategoryType>('close');
  const [dataEdit, setDataEdit] = useState<BlogCategory>();

  const [countBlog, { loading: countLoading }] = useLazyQuery<{
    blog_aggregate: { aggregate: { count: number } };
  }>(API_CountBlogByCategory, { fetchPolicy: 'network-only', notifyOnNetworkStatusChange: true });

  const { loading, refetch } = useQuery<{ blog_category: BlogCategory[] }>(API_GetBlogCategory, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    onCompleted: ({ blog_category }) => onFetchCategoryFinish(blog_category),
  });

  const [deleteMateria] = useMutation(API_DeleteBlogCategory);

  const onFetchCategoryFinish = async (blog_category: BlogCategory[]) => {
    let newData: BlogCategory[] = [];
    await Promise.all(
      blog_category.map((cate) =>
        countBlog({ variables: { cateID: cate.id } }).then(({ data }) =>
          newData.push({ ...cate, blog_total: data?.blog_aggregate.aggregate.count }),
        ),
      ),
    );
    setCategory(newData.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1)));
  };

  const onOpenEdit = (data: BlogCategory) => {
    setDataEdit(data);
    setFormType('edit');
  };

  const handleDelete = async (id: number) => {
    await deleteMateria({ variables: { id } })
      .then(() => {
        refetch();
        handleNotification.DeleteBlogCategorySuccess();
      })
      .catch((err) => handleErrorCatch(err, () => handleNotification.DeleteBlogCategoryFail()));
  };

  const handleConfirmDelete = (id: number, used: boolean) => {
    if (used) return handleNotification.CantDeleteBlogCategoryUsed();

    const modalConfirm = modal.confirm({
      title: 'Bạn có chắc muốn xóa danh mục này?',
      cancelText: 'Hủy',
      okText: 'Xác nhận',
      onOk: async () =>
        await Promise.all([modalConfirm.update({ cancelButtonProps: { disabled: true } }), handleDelete(id)]),
    });
  };

  const columns: ColumnsType<BlogCategory> = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      render: (_, record) => categories && categories.indexOf(record) + 1,
    },
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Hoạt động',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (value) =>
        value ? (
          <CheckCircleTwoTone twoToneColor='#52c41a' />
        ) : (
          <CloseCircleTwoTone twoToneColor={token.colorError} />
        ),
    },
    {
      title: 'Tổng Blog',
      dataIndex: 'blog_total',
      key: 'blog_total',
      align: 'center',
    },
    {
      title: 'Thao tác',
      dataIndex: 'blog_total',
      key: 'actions',
      align: 'center',
      render: (blog_total, record) => {
        return (
          <Space split={<Divider type='vertical' />}>
            <a onClick={() => onOpenEdit(record)}>
              <Typography.Text type='warning'>Sửa</Typography.Text>
            </a>
            <a onClick={() => handleConfirmDelete(record.id, (blog_total && blog_total > 0) || false)}>
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
            loading={loading || countLoading}
            columns={columns}
            dataSource={categories}
            pagination={{ showTotal: PaginationShowTotal }}
          />
        </Col>
      </Row>

      <FormBlogCategory
        type={formType}
        data={dataEdit}
        onClose={() => setFormType('close')}
        onSuccess={refetch}
      />

      {contextHolder}
    </SectionContent>
  );
};

export default BlogCategoryContainer;
