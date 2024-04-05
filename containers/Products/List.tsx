import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useLazyQuery } from '@apollo/client';
import {
  Button,
  ConfigProvider,
  Descriptions,
  Divider,
  Image,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
  message,
} from 'antd';
import { ColumnsType } from 'antd/es/table';

import { handleErrorCatch } from 'lib/utils';
import { convertToSlug, priceFormatter, removeSpaceString } from 'functions';
import { API_GetProduct } from 'graphql/product/query';

import { CopyOutlineIcon } from 'components/Fragments/Icon';
import SectionContent from 'components/Fragments/SectionContent';
import IconCheckOrUncheck from 'components/Fragments/IconCheckOrUncheck';
import PaginationShowTotal from 'components/Fragments/PaginationShowTotal';
import ProductFilterPanel from 'components/Pages/Product/FilterPanel';

import { ProductType, ProductVariation, ProductVariationType } from 'interface/Product';

type APIResponse = {
  product: ProductType[];
  product_aggregate: { aggregate: { count: number } };
  product_variation_aggregate: { aggregate: { count: number } };
};

const ProductListContainer = () => {
  const router = useRouter();

  const [fetchProduct, { loading, data }] = useLazyQuery<APIResponse>(API_GetProduct, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    onCompleted: ({ product }) => {
      if (product.length === 0 && router.query.page && router.query.page !== '1') onChangePage(1);
    },
    onError: handleErrorCatch,
  });

  const onChangePage = (page?: number) =>
    router.replace({ query: { ...router.query, page } }, undefined, { shallow: true });

  const onFilterProduct = useCallback(() => {
    const {
      tab,
      search,
      keyword = '',
      category,
      partner,
      stockType = 'all',
      stockMin,
      stockMax,
      sort,
      page,
    } = router.query;

    let filter: Record<string, any> = {};
    if (tab && tab !== 'all') filter['status'] = { _eq: tab === 'active' ? true : false };
    if (search === 'name') filter['name'] = { _ilike: `%${removeSpaceString(keyword.toString())}%` };

    // Stock
    if (stockType === 'pre-order') filter['preparation_time'] = { _is_null: false };
    else if (stockType === 'sold-out')
      Object.assign(filter, {
        preparation_time: { _is_null: true },
        product_variations: { ...filter['product_variations'], stock: { _lte: 0 } },
      });
    else if (search === 'sku' || search === 'vsku' || stockType === 'stock' || stockMin || stockMax)
      Object.assign(filter, {
        preparation_time: { _is_null: true },
        product_variations: {
          type: search === 'sku' || search === 'vsku' ? { _eq: search === 'sku' ? 1 : 2 } : undefined,
          sku: search === 'sku' || search === 'vsku' ? { _ilike: `%${keyword}%` } : undefined,
          stock: { _gte: stockMin, _lte: stockMax },
        },
      });

    // Category
    if (category)
      filter['product_category_relations'] =
        typeof category === 'string'
          ? { _or: [{ category_id: { _eq: category } }] }
          : { _or: category.map((c) => ({ category_id: { _eq: c } })) };

    // Partner
    if (partner) filter['partner_id'] = { _eq: partner };

    // Sort by
    let sortBy: Record<string, any> | undefined;
    if (sort === 'z-a') sortBy = { name: 'desc' };
    else if (sort === 'newest') sortBy = { created_at: 'desc' };
    else if (sort === 'oldest') sortBy = { created_at: 'asc' };

    fetchProduct({ variables: { where: filter, sort: sortBy, offset: (Number(page) - 1) * 10 } });
  }, [fetchProduct, router.query]);

  useEffect(() => {
    onFilterProduct();
  }, [onFilterProduct]);

  const handleCopyLink = (name: string, id: number) => {
    navigator.clipboard
      .writeText(`${process.env.NEXT_PUBLIC_WEBSITE_DOMAIN}/san-pham/${convertToSlug(name)}--${id}`)
      .then(() => message.success({ key: 'copy-link', content: 'Liên kết đã được sao chép' }));
  };

  const columns: ColumnsType<ProductType> = [
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (_, { image, background_color }) => (
        <Image
          src={image}
          alt=''
          height={80}
          width={80}
          style={{ objectFit: 'cover', background: background_color }}
          preview={{ mask: 'Xem' }}
        />
      ),
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (name, { product_variations }) => (
        <>
          <Typography.Text strong>{name}</Typography.Text>
          <br />
          <Typography.Text type='secondary' style={{ fontSize: 12 }}>
            SKU sản phẩm:{' '}
            {product_variations.find((v) => v.type === ProductVariationType.ByProduct)?.sku || '-'}
          </Typography.Text>
        </>
      ),
    },
    {
      title: 'Phân loại hàng',
      dataIndex: 'product_variations',
      key: 'product_variations',
      width: '170px',
      render: (_, { product_variations }) =>
        product_variations.every((v) => v.type === ProductVariationType.ByOption)
          ? product_variations.length + ' phân loại'
          : 'Không có phân loại',
    },
    {
      title: 'Kho hàng',
      dataIndex: 'stock',
      key: 'total_stock',
      align: 'center',
      render: (_, { product_variations, preparation_time }) => {
        const isPreOrder = typeof preparation_time === 'number' && preparation_time > 0;
        const stock = product_variations.every((v) => v.type === ProductVariationType.ByOption)
          ? product_variations?.reduce((stock, variation) => stock + variation.stock, 0)
          : product_variations[0].stock;
        return isPreOrder ? (
          <Tag color='processing'>Đặt trước</Tag>
        ) : (
          stock || <Tag color='error'>Hết hàng</Tag>
        );
      },
    },
    {
      title: 'Xuất bản',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: '100px',
      render: (status) => <IconCheckOrUncheck checked={status} />,
    },
    {
      title: 'Thao tác',
      dataIndex: 'actions',
      key: 'actions',
      align: 'center',
      width: '100px',
      render: (_, { id, name }) => (
        <Space split={<Divider type='vertical' />} size={0}>
          <Tooltip title='Chỉnh sửa'>
            <Link href={'/products/edit/' + id}>
              <Typography.Text type='warning'>
                <EditOutlined />
              </Typography.Text>
            </Link>
          </Tooltip>
          <Typography.Text
            copyable={{
              text: `${process.env.NEXT_PUBLIC_WEBSITE_DOMAIN}/san-pham/${convertToSlug(name)}--${id}`,
              icon: <CopyOutlineIcon />,
              tooltips: ['Sao chép link'],
            }}
          />
        </Space>
      ),
    },
  ];

  const variationColumns: ColumnsType<ProductVariation> = [
    { title: 'SKU phân loại', dataIndex: 'sku', key: 'sku' },
    { title: 'Phân loại hàng', dataIndex: 'combName', key: 'combName' },
    { title: 'Giá', dataIndex: 'price', key: 'price', render: (price) => priceFormatter(price) },
    {
      title: 'Kho hàng',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock) => stock || <Typography.Text type='danger'>Hết hàng</Typography.Text>,
    },
  ];

  return (
    <>
      <ProductFilterPanel />

      <SectionContent
        tabList={[
          { key: 'all', tab: 'Tất cả' },
          { key: 'active', tab: 'Đang hoạt động' },
          { key: 'unlisted', tab: 'Đã ẩn' },
        ]}
        tabBarExtraContent={
          <Button type='primary' icon={<PlusOutlined />}>
            <Link href='/products/add'>Thêm sản phẩm</Link>
          </Button>
        }
        activeTabKey={router.query.tab?.toString() || 'all'}
        onTabChange={(tab) =>
          router.replace({ query: { ...router.query, tab, page: 1 } }, undefined, { shallow: true })
        }
      >
        <ConfigProvider theme={{ components: { Descriptions: { itemPaddingBottom: 4 } } }}>
          <Descriptions
            style={{ marginBottom: 24 }}
            items={[
              { key: 'product', label: 'Tổng sản phẩm', children: data?.product_aggregate.aggregate.count },
              {
                key: 'variation',
                label: 'Tổng phân loại',
                children: data?.product_variation_aggregate.aggregate.count,
              },
            ]}
          />
        </ConfigProvider>

        <Table
          rowKey='id'
          columns={columns}
          dataSource={data?.product}
          loading={loading}
          expandable={{
            rowExpandable: (record) =>
              record.product_variations.every((v) => v.type === ProductVariationType.ByOption) || false,
            expandedRowRender: (record) => (
              <ConfigProvider theme={{ token: { fontSize: 12, fontWeightStrong: 500 } }}>
                <Table
                  rowKey='combUnicode'
                  columns={variationColumns.filter((i) => !(i.key === 'stock' && record.preparation_time))}
                  dataSource={record.product_variations}
                  size='small'
                  pagination={false}
                  style={{ paddingLeft: 15 }}
                />
              </ConfigProvider>
            ),
          }}
          pagination={{
            total: data?.product_aggregate.aggregate.count,
            current: Number(router.query.page?.toString() || 1),
            showTotal: PaginationShowTotal,
            onChange: onChangePage,
          }}
        />
      </SectionContent>
    </>
  );
};

export default ProductListContainer;
