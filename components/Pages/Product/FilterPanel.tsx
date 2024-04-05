import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { useQuery } from '@apollo/client';
import { styled } from 'styled-components';
import { Button, Col, Form, Input, InputNumber, Row, Select, Space, TreeSelect, message } from 'antd';

import { removeEmptyObject } from 'functions';
import { API_GetDataFilter } from 'graphql/product/query';

import SectionContent from 'components/Fragments/SectionContent';

import { CategoryProductType } from 'interface/Category';
import { PartnerType } from 'interface/Partner';

const FilterPanelWrapper = styled.div`
  .ant-form-item {
    margin-bottom: 0;
    .ant-form-item-row {
      display: grid;
      grid-template-columns: 70px auto;
      .ant-form-item-label {
        text-align: left;
        label:after {
          display: none;
        }
      }
    }
  }
`;

interface TreeData {
  key: string | number;
  title: string;
  value: string | number;
  children?: TreeData[];
}
interface FilterType {
  search: string;
  keyword?: string;
  partner?: string;
  category?: string | string[];
  stockType?: string;
  stockMin?: string | number;
  stockMax?: string | number;
  sort: string;
}

const ProductFilterPanel = () => {
  const router = useRouter();

  const [filter, setFilter] = useState<FilterType>({ search: 'name', sort: 'a-z' });

  const { loading: fetchingDataFilter, data: dataFilter } = useQuery<{
    product_category: CategoryProductType[];
    partner: PartnerType[];
  }>(API_GetDataFilter, { fetchPolicy: 'network-only', notifyOnNetworkStatusChange: true });

  const categories: TreeData[] | undefined = dataFilter?.product_category
    .filter((i) => !i.parent_id)
    .map((i) => {
      const children = dataFilter.product_category
        .filter((x) => x.parent_id === i.id)
        .map((y) => ({ key: y.id, title: y.name, value: y.id }));
      return { key: i.id, title: i.name, value: i.id, children: children.length > 0 ? children : undefined };
    });

  useEffect(() => {
    const { search, keyword, category, partner, stockType, stockMin, stockMax, sort } = router.query;
    setFilter({
      search: search?.toString() ?? 'name',
      keyword: keyword?.toString(),
      category,
      partner: partner?.toString(),
      stockType: stockType?.toString() ?? 'all',
      stockMin: stockMin ? Number(stockMin) : undefined,
      stockMax: stockMax ? Number(stockMax) : undefined,
      sort: sort?.toString() ?? 'a-z',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeRouterQuery = () => {
    if (filter.keyword && filter.keyword.replace(/\s+/g, '').length < 2)
      message.warning({ key: 'validate-search', content: 'Vui lòng nhập tối thiểu 2 ký tự' });
    else if (filter.stockType === 'stock' && !(filter.stockMin && filter.stockMax))
      message.warning({ key: 'validate-search', content: 'Vui lòng nhập khoảng kho' });
    else {
      const query = removeEmptyObject({ ...router.query, ...filter, stockMax: filter.stockMax?.toString() });
      router.replace({ pathname: '/products', query }, undefined, { shallow: true });
    }
  };

  const onResetFilter = () => {
    router.replace({ pathname: '/products', query: { tab: router.query.tab || 'all' } }, undefined, {
      shallow: true,
    });
    setFilter({ search: 'name', sort: 'a-z', stockType: 'all' });
  };

  const ButtonAction = [
    <Space key='btn-action' style={{ display: 'flex', justifyContent: 'end' }}>
      <Button onClick={onResetFilter}>Đặt lại</Button>
      <Button type='primary' onClick={onChangeRouterQuery}>
        Tìm kiếm
      </Button>
    </Space>,
  ];

  return (
    <SectionContent title='Công cụ tìm kiếm' actions={ButtonAction}>
      <FilterPanelWrapper>
        <Row gutter={[16, 20]}>
          <Col span={24} xl={12} xxl={8}>
            <Input
              addonBefore={
                <Select
                  value={filter.search}
                  options={[
                    { label: 'Tên sản phẩm', value: 'name' },
                    { label: 'SKU sản phẩm', value: 'sku' },
                    { label: 'SKU phân loại', value: 'vsku' },
                  ]}
                  onChange={(search) => setFilter((filter) => ({ ...filter, search }))}
                  style={{ width: 140 }}
                />
              }
              placeholder='Vui lòng nhập tối thiểu 2 ký tự'
              value={filter.keyword}
              onChange={(e) => setFilter((filter) => ({ ...filter, keyword: e.target.value }))}
              onPressEnter={onChangeRouterQuery}
            />
          </Col>

          <Col span={24} xl={12} xxl={8}>
            <Form.Item label='Danh mục'>
              <TreeSelect
                placeholder='Chọn'
                treeData={categories}
                treeCheckable
                allowClear
                loading={fetchingDataFilter}
                filterTreeNode={(input, treeNode) =>
                  treeNode.title?.toString().toLowerCase().includes(input.toLowerCase()) || false
                }
                value={filter.category}
                style={{ width: '100%' }}
                onChange={(category) => setFilter((filter) => ({ ...filter, category }))}
              />
            </Form.Item>
          </Col>

          <Col span={24} xl={12} xxl={8}>
            <Form.Item label='Kho hàng'>
              <Space.Compact block>
                <Select
                  value={filter.stockType}
                  options={[
                    { label: 'Tất cả', value: 'all' },
                    { label: 'Số lượng', value: 'stock' },
                    { label: 'Hết hàng', value: 'sold-out' },
                    { label: 'Hàng đặt trước', value: 'pre-order' },
                  ]}
                  onChange={(stockType) =>
                    setFilter((filter) => ({
                      ...filter,
                      stockType,
                      stockMin: stockType !== 'stock' ? undefined : filter.stockMin,
                      stockMax: stockType !== 'stock' ? undefined : filter.stockMax,
                    }))
                  }
                  style={{ width: 220 }}
                />
                <InputNumber
                  min={0}
                  value={filter.stockMin ? filter.stockMin : null}
                  placeholder='Tối thiểu'
                  disabled={filter.stockType !== 'stock'}
                  style={{ width: '50%' }}
                  onChange={(value) =>
                    setFilter((filter) => ({ ...filter, stockMin: Math.round(value as number) || undefined }))
                  }
                  onBlur={() =>
                    setFilter((filter) => ({
                      ...filter,
                      stockMax: (filter.stockMin || 0) > (filter.stockMax || 0) ? undefined : filter.stockMax,
                    }))
                  }
                />
                <InputNumber
                  min={0}
                  value={filter.stockMax}
                  placeholder='Tối đa'
                  style={{ width: '50%' }}
                  disabled={filter.stockType !== 'stock'}
                  onChange={(value) => {
                    const stockMax = value !== null ? Math.round(value as number) : undefined;
                    setFilter((filter) => ({ ...filter, stockMax }));
                  }}
                  onBlur={() =>
                    setFilter((filter) => {
                      const stockMin =
                        typeof filter.stockMax !== 'undefined' && (filter.stockMin || 0) > filter.stockMax
                          ? undefined
                          : filter.stockMin;
                      return { ...filter, stockMin };
                    })
                  }
                />
              </Space.Compact>
            </Form.Item>
          </Col>

          <Col span={24} xl={12} xxl={8}>
            <Form.Item label='Đối tác'>
              <Select
                placeholder='Chọn'
                allowClear
                showSearch
                loading={fetchingDataFilter}
                value={filter.partner}
                filterOption={(input, option) => !!option?.label.toLowerCase().includes(input.toLowerCase())}
                options={dataFilter?.partner.map(({ id, name }) => ({ label: name, value: id.toString() }))}
                onChange={(partner) => setFilter((filter) => ({ ...filter, partner }))}
              />
            </Form.Item>
          </Col>

          <Col span={24} xl={12} xxl={8}>
            <Form.Item label='Sắp xếp'>
              <Select
                value={filter.sort}
                options={[
                  { label: 'Tên từ A đến Z', value: 'a-z' },
                  { label: 'Tên từ Z đến A', value: 'z-a' },
                  { label: 'Ngày tạo mới nhất', value: 'newest' },
                  { label: 'Ngày tạo cũ nhất', value: 'oldest' },
                ]}
                onChange={(sort) => setFilter((f) => ({ ...f, sort }))}
              />
            </Form.Item>
          </Col>
        </Row>
      </FilterPanelWrapper>
    </SectionContent>
  );
};

export default ProductFilterPanel;
