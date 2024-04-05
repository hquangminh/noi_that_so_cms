import { useState } from 'react';

import { useMutation, useQuery } from '@apollo/client';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Modal, Row, Space, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';

import { handleErrorCatch } from 'lib/utils';
import { API_GetStyleType } from 'graphql/category/query';
import { API_DeleteStyleType } from 'graphql/category/mutation';

import SectionContent from 'components/Fragments/SectionContent';
import IconCheckOrUncheck from 'components/Fragments/IconCheckOrUncheck';
import FormStyleCategory, { FormStyleCategoryType } from 'components/Pages/Category/FormStyle';
import * as handleNotification from 'components/Pages/Category/Notification';

import { CategoryStyleType } from 'interface/Category';

const StyleCategory = () => {
  const [modal, contextHolder] = Modal.useModal();

  const [formType, setFormType] = useState<FormStyleCategoryType>('close');
  const [roomEdit, setRoomEdit] = useState<CategoryStyleType>();

  const { loading, data, refetch } = useQuery<{ style_type: CategoryStyleType[] }>(API_GetStyleType, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });
  const [deleteRoomType] = useMutation(API_DeleteStyleType);

  const onOpenEdit = (data: CategoryStyleType) => {
    setRoomEdit(data);
    setFormType('edit');
  };

  const handleDelete = async (id: number) => {
    await deleteRoomType({ variables: { id } })
      .then(() => {
        refetch();
        handleNotification.DeleteStyleTypeSuccess();
      })
      .catch((err) => handleErrorCatch(err, () => handleNotification.DeleteStyleTypeFail()));
  };

  const handleConfirmDelete = (id: number, used: boolean) => {
    if (used) return handleNotification.CantDeleteStyleTypeUsed();

    const modalConfirm = modal.confirm({
      title: 'Bạn có chắc muốn xóa phong cách này?',
      cancelText: 'Hủy',
      okText: 'Xác nhận',
      onOk: async () =>
        await Promise.all([modalConfirm.update({ cancelButtonProps: { disabled: true } }), handleDelete(id)]),
    });
  };

  const columns: ColumnsType<CategoryStyleType> = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      render: (_, record) => data && data.style_type.indexOf(record) + 1,
    },
    {
      title: 'Tên phong cách',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Tổng Portfolio',
      dataIndex: 'portfolio_styles_aggregate',
      key: 'portfolio',
      render: (value) => value.aggregate.count,
    },
    {
      title: 'Tổng sản phẩm',
      dataIndex: 'product_styles_aggregate',
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
          record.portfolio_styles_aggregate.aggregate.count > 0 ||
          record.product_styles_aggregate.aggregate.count > 0;
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
            Thêm phong cách
          </Button>
        </Col>

        <Col span={24}>
          <Table loading={loading} columns={columns} dataSource={data?.style_type} rowKey='id' />
        </Col>
      </Row>

      <FormStyleCategory
        type={formType}
        data={roomEdit}
        onClose={() => setFormType('close')}
        onSuccess={refetch}
      />

      {contextHolder}
    </SectionContent>
  );
};

export default StyleCategory;
