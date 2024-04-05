import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Button, Col, Divider, Modal, Row, Space, Table, Tooltip, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';

import { removeEmptyObject, removeSpaceString } from 'functions';
import { handleErrorCatch } from 'lib/utils';
import { API_GetBlog } from 'graphql/blog/query';
import { APT_DeleteBlog } from 'graphql/blog/mutation';
import s3Services from 'services/s3-services';

import SectionContent from 'components/Fragments/SectionContent';
import BlogFilterPanel from 'components/Pages/Blogs/FilterPanel';
import IconCheckOrUncheck from 'components/Fragments/IconCheckOrUncheck';
import PaginationShowTotal from 'components/Fragments/PaginationShowTotal';
import { DeleteBlogFail, DeleteBlogSuccess } from 'components/Pages/Blogs/Notification';

import { BlogType, GetBlogResponse } from 'interface/Blog';

const BlogListContainer = () => {
  const router = useRouter();
  const [modal, contextHolder] = Modal.useModal();

  const [fetchBlog, { data, loading }] = useLazyQuery<GetBlogResponse>(API_GetBlog, {
    variables: { where: {} },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      if (router.query.page && router.query.page !== '1' && data.blog.length === 0) onChangePage();
    },
    onError: handleErrorCatch,
  });
  const [deleteBlog] = useMutation<{ delete_blog: { returning: { image: string }[] } }>(APT_DeleteBlog);

  const onChangePage = (page?: number) =>
    router.replace({ query: removeEmptyObject({ ...router.query, page }) }, undefined, { shallow: true });

  const onFetchBlog = useCallback(() => {
    const { title, category, page } = router.query;
    let where: { title?: { _ilike: string }; category_id?: { _eq: string } } = {};
    if (title) where.title = { _ilike: `%${removeSpaceString(title.toString())}%` };
    if (category) where.category_id = { _eq: category.toString() };
    fetchBlog({ variables: { where, offset: (Number(page || 1) - 1) * 10 } });
  }, [fetchBlog, router.query]);

  useEffect(() => {
    onFetchBlog();
  }, [onFetchBlog]);

  const handleDelete = async (id: number) => {
    await deleteBlog({ variables: { id } })
      .then(({ data }) => {
        if (data?.delete_blog) s3Services.deleteFile(data.delete_blog.returning[0].image);
        onFetchBlog();
        DeleteBlogSuccess();
      })
      .catch((err) => handleErrorCatch(err, () => DeleteBlogFail()));
  };

  const handleConfirmDelete = (id: number) => {
    const modalConfirm = modal.confirm({
      title: 'Bạn có chắc muốn xóa Blog này?',
      cancelText: 'Hủy',
      okText: 'Xác nhận',
      autoFocusButton: null,
      onOk: async () =>
        await Promise.all([modalConfirm.update({ cancelButtonProps: { disabled: true } }), handleDelete(id)]),
    });
  };

  const columns: ColumnsType<BlogType> = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: '60px',
      render: (_, __, index) => Number(router.query.page ?? 1) * 10 + index - 9,
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (value) => <img src={value} alt='' height='80' style={{ objectFit: 'cover' }} />,
    },
    {
      title: 'Danh mục',
      dataIndex: 'blog_category',
      key: 'blog_category',
      width: '200px',
      render: (value) => value.name,
    },
    {
      title: 'Xuất bản',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: '100px',
      render: (value) => <IconCheckOrUncheck checked={value} />,
    },
    {
      title: 'Thao tác',
      dataIndex: 'actions',
      key: 'actions',
      align: 'center',
      width: '100px',
      render: (_, record) => (
        <Space split={<Divider type='vertical' />} size={4}>
          <Tooltip title='Chỉnh sửa'>
            <Link href={'/blogs/edit/' + record.id}>
              <Typography.Text type='warning'>
                <EditOutlined />
              </Typography.Text>
            </Link>
          </Tooltip>
          <Tooltip title='Xóa'>
            <a onClick={() => handleConfirmDelete(record.id)}>
              <Typography.Text type='danger'>
                <DeleteOutlined />
              </Typography.Text>
            </a>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <>
      <BlogFilterPanel />

      <SectionContent>
        <Row gutter={[0, 24]} justify='end'>
          <Col flex='none'>
            <Button type='primary' icon={<PlusOutlined />}>
              <Link href='/blogs/add'>Thêm blog</Link>
            </Button>
          </Col>

          <Col span={24}>
            <Table
              rowKey='id'
              columns={columns}
              dataSource={data?.blog}
              loading={loading}
              pagination={{
                current: Number(router.query.page ?? 1),
                total: data?.blog_aggregate.aggregate.count,
                showTotal: PaginationShowTotal,
                onChange: onChangePage,
              }}
            />
          </Col>
        </Row>
      </SectionContent>

      {contextHolder}
    </>
  );
};

export default BlogListContainer;
