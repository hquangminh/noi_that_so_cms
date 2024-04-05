import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { styled } from 'styled-components';
import { useQuery } from '@apollo/client';
import { Button, Col, Form, Input, Row, Select, Space } from 'antd';

import { removeEmptyObject, removeSpaceString } from 'functions';
import { API_GetRoomType, API_GetStyleType } from 'graphql/category/query';

import SectionContent from 'components/Fragments/SectionContent';

import { CategoryRoomType, CategoryStyleType } from 'interface/Category';

const Wrapper = styled.div`
  .ant-form-item {
    margin-bottom: 0;
  }
`;

type Filter = { name?: string; sort: string; room?: number[]; style?: number[] };

const PortfolioFilterPanel = () => {
  const router = useRouter();

  const [filter, setFilter] = useState<Filter>({ sort: 'name|asc' });

  const { loading: fetchingRoom, data: room } = useQuery<{ room_type: CategoryRoomType[] }>(API_GetRoomType, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });
  const { loading: fetchingStyle, data: style } = useQuery<{ style_type: CategoryStyleType[] }>(
    API_GetStyleType,
    { fetchPolicy: 'network-only', notifyOnNetworkStatusChange: true },
  );

  useEffect(() => {
    const { name, sort, room, style } = router.query;
    setFilter({
      name: name?.toString(),
      sort: sort?.toString() || 'name|asc',
      room: typeof room === 'string' ? [Number(room)] : room?.map((i) => Number(i)),
      style: typeof style === 'string' ? [Number(style)] : style?.map((i) => Number(i)),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeRouterQuery = () => {
    const query = removeEmptyObject({ ...filter, name: removeSpaceString(filter.name || '') });
    router.replace({ pathname: '/portfolio', query }, undefined, { shallow: true });
  };

  const onResetFilter = () => {
    router.replace('/portfolio', undefined, { shallow: true });
    setFilter({ sort: 'name|asc' });
  };

  return (
    <SectionContent title='Công cụ tìm kiếm'>
      <Wrapper>
        <Row gutter={[16, 16]}>
          <Col span={24} xl={12}>
            <Form.Item label='Tên' labelCol={{ flex: '90px' }}>
              <Input
                value={filter.name}
                placeholder='Nhập tên Portfolio'
                onChange={(e) => setFilter((f) => ({ ...f, name: e.target.value }))}
              />
            </Form.Item>
          </Col>

          <Col span={24} xl={12}>
            <Form.Item label='Sắp xếp' labelCol={{ flex: '90px' }}>
              <Select
                value={filter.sort}
                options={[
                  { label: 'Tên tăng dần', value: 'name|asc' },
                  { label: 'Tên giảm dần', value: 'name|desc' },
                  { label: 'Ngày tạo gần nhất', value: 'created_at|desc' },
                  { label: 'Ngày tạo xa nhất', value: 'created_at|asc' },
                ]}
                onChange={(sort) => setFilter((f) => ({ ...f, sort }))}
              />
            </Form.Item>
          </Col>

          <Col span={24} xl={12}>
            <Form.Item label='Phòng' labelCol={{ flex: '90px' }}>
              <Select
                mode='multiple'
                loading={fetchingRoom}
                value={filter.room}
                options={room?.room_type.map(({ id, name }) => ({ label: name, value: id }))}
                optionFilterProp='label'
                onChange={(room) => setFilter((f) => ({ ...f, room }))}
              />
            </Form.Item>
          </Col>

          <Col span={24} xl={12}>
            <Form.Item label='Phong cách' labelCol={{ flex: '90px' }}>
              <Select
                mode='multiple'
                loading={fetchingStyle}
                value={filter.style}
                options={style?.style_type.map(({ id, name }) => ({ label: name, value: id }))}
                optionFilterProp='label'
                onChange={(style) => setFilter((f) => ({ ...f, style }))}
              />
            </Form.Item>
          </Col>

          <Col span={24} style={{ textAlign: 'right' }}>
            <Space>
              <Button type='primary' onClick={onChangeRouterQuery}>
                Tìm kiếm
              </Button>
              <Button onClick={onResetFilter}>Đặt lại</Button>
            </Space>
          </Col>
        </Row>
      </Wrapper>
    </SectionContent>
  );
};

export default PortfolioFilterPanel;
