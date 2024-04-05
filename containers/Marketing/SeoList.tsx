import Link from 'next/link';

import { useMutation, useQuery } from '@apollo/client';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Modal, Space, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';

import { handleErrorCatch } from 'lib/utils';
import { API_GetSeoPage } from 'graphql/seo-page/query';
import { API_DeleteSeoPage } from 'graphql/seo-page/mutation';
import s3Services from 'services/s3-services';

import SectionContent from 'components/Fragments/SectionContent';
import { DeleteSeoFailed, DeleteSeoSuccess, PageList } from 'components/Pages/Marketing/SeoForm';

import { SeoPageType } from 'interface/SeoPage';

const MarketingSeoListContainer = () => {
  const [modal, contextHolder] = Modal.useModal();

  const { data, loading, refetch } = useQuery<{ seo_page: SeoPageType[] }>(API_GetSeoPage, {
    fetchPolicy: 'network-only',
  });
  const [onDelete] = useMutation<{ delete_seo_page: { returning: SeoPageType[] } }>(API_DeleteSeoPage, {
    onCompleted: ({ delete_seo_page }) => {
      refetch();
      DeleteSeoSuccess();
      if (delete_seo_page.returning[0]?.image) s3Services.deleteFile(delete_seo_page.returning[0].image);
    },
    onError: (err) => handleErrorCatch(err, () => DeleteSeoFailed()),
  });

  const handleConfirmDelete = (id: number) => {
    const modalConfirm = modal.confirm({
      title: 'Bạn có chắc muốn xóa không?',
      cancelText: 'Hủy',
      okText: 'Xác nhận',
      onOk: async () =>
        await Promise.all([
          modalConfirm.update({ cancelButtonProps: { disabled: true } }),
          onDelete({ variables: { id } }),
        ]),
    });
  };

  const columns: ColumnsType<SeoPageType> = [
    {
      title: 'Trang',
      dataIndex: 'page',
      key: 'page',
      width: 100,
      render: (page) => PageList.find((i) => i.value === page)?.label,
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      width: 100,
      render: (img) =>
        img ? <img src={img} alt='' width='70' height='70' style={{ objectFit: 'contain' }} /> : null,
    },
    { title: 'Tiêu đề', dataIndex: 'title', key: 'title', width: 200 },
    { title: 'Nội dung', dataIndex: 'description', key: 'description', width: 300 },
    {
      title: 'Thao tác',
      dataIndex: 'actions',
      key: 'actions',
      align: 'center',
      width: 100,
      render: (_, record) => (
        <Space split={<Divider type='vertical' />}>
          <a onClick={() => handleConfirmDelete(record.id)}>
            <Typography.Text type='danger'>Xóa</Typography.Text>
          </a>
          <Link href={`/marketing/seo/edit/${record.id}`}>
            <Typography.Text type='warning'>Sửa</Typography.Text>
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <SectionContent
      title='Danh sách các trang có nội dung SEO'
      extra={
        <Button type='primary' icon={<PlusOutlined />}>
          <Link href='/marketing/seo/add'>Tạo SEO</Link>
        </Button>
      }
    >
      <Table loading={loading} columns={columns} dataSource={data?.seo_page} />
      {contextHolder}
    </SectionContent>
  );
};

export default MarketingSeoListContainer;
