import Link from 'next/link';

import { useMutation, useQuery } from '@apollo/client';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Image, Modal, Row, Space, Table, Typography, notification } from 'antd';
import { ColumnsType } from 'antd/es/table';

import { handleErrorCatch } from 'lib/utils';
import { API_GetHomepageBanners } from 'graphql/homepage/query';
import { API_DeleteHomePageBanner } from 'graphql/homepage/mutation';
import s3Services from 'services/s3-services';

import SectionContent from 'components/Fragments/SectionContent';
import IconCheckOrUncheck from 'components/Fragments/IconCheckOrUncheck';

import { HomePageBanner } from 'interface/HomePage';

const BannerListContainer = () => {
  const [modal, contextHolder] = Modal.useModal();

  const { loading, data, refetch } = useQuery<{ homepage_banner: HomePageBanner[] }>(API_GetHomepageBanners, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });
  const [deleteMateria] = useMutation(API_DeleteHomePageBanner);

  const handleConfirmDelete = (data: HomePageBanner) => {
    const modalConfirm = modal.confirm({
      title: 'Bạn có chắc muốn xóa Banner này?',
      cancelText: 'Hủy',
      okText: 'Xác nhận',
      onOk: async () =>
        await Promise.all([
          modalConfirm.update({ cancelButtonProps: { disabled: true } }),
          deleteMateria({ variables: { id: data.id } }),
        ])
          .then(() => {
            if (data) s3Services.deleteFile([data.image, data?.background]);
            refetch();
            notification.success({
              key: 'delete-banner-success',
              message: 'Xóa Banner',
              description: 'Đã xóa Banner thành công',
            });
          })
          .catch((error) =>
            handleErrorCatch(error, () =>
              notification.error({
                key: 'delete-banner-failed',
                message: 'Xóa Banner',
                description: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
              }),
            ),
          ),
    });
  };

  const columns: ColumnsType<HomePageBanner> = [
    { title: 'Vị trí', dataIndex: 'index', key: 'index', width: 90 },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      width: 150,
      render: (image) => <Image src={image} alt='' width={100} />,
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: (title) => <p dangerouslySetInnerHTML={{ __html: title }} />,
    },
    { title: 'Phụ đề', dataIndex: 'caption', key: 'caption', ellipsis: true },
    {
      title: 'Hoạt dộng',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: 120,
      render: (status) => <IconCheckOrUncheck checked={status} />,
    },
    {
      title: 'Thao tác',
      dataIndex: 'actions',
      key: 'actions',
      align: 'center',
      width: 150,
      render: (_, record) => {
        return (
          <Space split={<Divider type='vertical' />}>
            <Link href={`/landing-page/banner/edit/${record.id}`}>
              <Typography.Text type='warning'>Sửa</Typography.Text>
            </Link>
            <a onClick={() => handleConfirmDelete(record)}>
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
          <Button type='primary' icon={<PlusOutlined />}>
            <Link href={`/landing-page/banner/add`}>Thêm Banner</Link>
          </Button>
        </Col>

        <Col span={24}>
          <Table loading={loading} columns={columns} dataSource={data?.homepage_banner} rowKey='id' />
        </Col>
      </Row>

      {contextHolder}
    </SectionContent>
  );
};

export default BannerListContainer;
