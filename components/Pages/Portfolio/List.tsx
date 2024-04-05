import Link from 'next/link';

import { useMutation } from '@apollo/client';
import { Button, Divider, Image, Modal, Space, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';

import { handleErrorCatch } from 'lib/utils';
import { API_DeletePortfolio } from 'graphql/portfolio/mutation';

import SectionContent from 'components/Fragments/SectionContent';
import PaginationShowTotal from 'components/Fragments/PaginationShowTotal';
import * as handleNotification from './Notification';

import { PortfolioType } from 'interface/Portfolio';

type Props = {
  loading?: boolean;
  data?: PortfolioType[];
  total?: number;
  page: number;
  onChangePage: (page: number) => void;
  onFetchData: () => void;
};

const PortfolioList = ({ loading, data, total, page, onChangePage, onFetchData }: Props) => {
  const [modal, contextHolder] = Modal.useModal();

  const [deletePortfolio] = useMutation(API_DeletePortfolio);

  const handleConfirmDelete = (id: number) => {
    const modalConfirm = modal.confirm({
      title: 'Bạn có chắc muốn xóa Portfolio này?',
      cancelText: 'Hủy',
      okText: 'Xác nhận',
      onOk: async () =>
        await Promise.all([
          modalConfirm.update({ cancelButtonProps: { disabled: true } }),
          deletePortfolio({ variables: { id } }),
        ])
          .then(() => {
            onFetchData();
            handleNotification.DeletePortfolioSuccess();
          })
          .catch((err) => {
            handleErrorCatch(err, () => {
              modalConfirm.update({ cancelButtonProps: { disabled: false } });
              handleNotification.DeletePortfolioFail();
            });
          }),
    });
  };

  const columns: ColumnsType<PortfolioType> = [
    { title: 'STT', key: 'stt', render: (_, __, index) => (page - 1) * 10 + index + 1 },
    {
      title: 'Hình ảnh',
      key: 'image',
      dataIndex: 'image',
      render: (img) => <Image src={img} alt='' width='100px' height='80px' preview={{ mask: 'Phóng to' }} />,
    },
    { title: 'Tên', key: 'name', dataIndex: 'name' },
    {
      title: 'Thao tác',
      key: 'actions',
      align: 'center',
      width: '200px',
      render: (_, { id }) => (
        <Space split={<Divider type='vertical' />}>
          <Link href={'/portfolio/edit/' + id}>
            <Typography.Text type='warning'>Sửa</Typography.Text>
          </Link>
          <a onClick={() => handleConfirmDelete(id)}>
            <Typography.Text type='danger'>Xóa</Typography.Text>
          </a>
        </Space>
      ),
    },
  ];

  return (
    <SectionContent
      extra={
        <Button type='primary'>
          <Link href='/portfolio/add'>Tạo Portfolio</Link>
        </Button>
      }
    >
      <Table
        rowKey='id'
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{ total, current: page, showTotal: PaginationShowTotal, onChange: onChangePage }}
      />
      {contextHolder}
    </SectionContent>
  );
};

export default PortfolioList;
