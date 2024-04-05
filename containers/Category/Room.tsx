import { useState } from 'react';

import { useMutation, useQuery } from '@apollo/client';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Modal, Row, Space, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';

import { handleErrorCatch } from 'lib/utils';
import { API_GetRoomType } from 'graphql/category/query';
import { API_DeleteRoomType } from 'graphql/category/mutation';

import SectionContent from 'components/Fragments/SectionContent';
import IconCheckOrUncheck from 'components/Fragments/IconCheckOrUncheck';
import FormRoomCategory, { FormRoomCategoryType } from 'components/Pages/Category/FormRoom';
import * as handleNotification from 'components/Pages/Category/Notification';

import { CategoryRoomType } from 'interface/Category';

const RoomCategory = () => {
  const [modal, contextHolder] = Modal.useModal();

  const [formType, setFormType] = useState<FormRoomCategoryType>('close');
  const [roomEdit, setRoomEdit] = useState<CategoryRoomType>();

  const { loading, data, refetch } = useQuery<{ room_type: CategoryRoomType[] }>(API_GetRoomType, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });
  const [deleteRoomType] = useMutation(API_DeleteRoomType);

  const onOpenEdit = (data: CategoryRoomType) => {
    setRoomEdit(data);
    setFormType('edit');
  };

  const handleDelete = async (roomID: number) => {
    await deleteRoomType({ variables: { id: roomID } })
      .then(() => {
        refetch();
        handleNotification.DeleteRoomTypeSuccess();
      })
      .catch((err) => handleErrorCatch(err, () => handleNotification.DeleteRoomTypeFail()));
  };

  const handleConfirmDelete = (roomID: number, used: boolean) => {
    if (used) return handleNotification.CantDeleteRoomTypeUsed();

    const modalConfirm = modal.confirm({
      title: 'Bạn có chắc muốn xóa phòng này?',
      cancelText: 'Hủy',
      okText: 'Xác nhận',
      onOk: async () =>
        await Promise.all([
          modalConfirm.update({ cancelButtonProps: { disabled: true } }),
          handleDelete(roomID),
        ]),
    });
  };

  const columns: ColumnsType<CategoryRoomType> = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      render: (_, record) => data && data.room_type.indexOf(record) + 1,
    },
    {
      title: 'Tên phòng',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Tổng Portfolio',
      dataIndex: 'portfolio_rooms_aggregate',
      key: 'portfolio',
      render: (value) => value.aggregate.count,
    },
    {
      title: 'Tổng sản phẩm',
      dataIndex: 'product_rooms_aggregate',
      key: 'product',
      render: (value) => value.aggregate.count,
    },
    {
      title: 'Nổi bật',
      dataIndex: 'outstanding',
      key: 'outstanding',
      align: 'center',
      render: (value) => <IconCheckOrUncheck checked={value} />,
    },
    {
      title: 'Thao tác',
      dataIndex: 'actions',
      key: 'actions',
      align: 'center',
      render: (_, record) => {
        const used =
          record.portfolio_rooms_aggregate.aggregate.count > 0 ||
          record.product_rooms_aggregate.aggregate.count > 0;
        return (
          <Space split={<Divider type='vertical' />}>
            <a onClick={() => onOpenEdit(record)}>
              <Typography.Text type='warning'>Sửa</Typography.Text>
            </a>
            <a onClick={() => handleConfirmDelete(record.id, used)}>
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
            Thêm loại phòng
          </Button>
        </Col>

        <Col span={24}>
          <Table loading={loading} columns={columns} dataSource={data?.room_type} rowKey='id' />
        </Col>
      </Row>

      <FormRoomCategory
        type={formType}
        data={roomEdit}
        onClose={() => setFormType('close')}
        onSuccess={refetch}
      />

      {contextHolder}
    </SectionContent>
  );
};

export default RoomCategory;
