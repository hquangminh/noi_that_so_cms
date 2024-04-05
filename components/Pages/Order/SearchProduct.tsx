import { Dispatch, SetStateAction, useContext, useState } from 'react';

import { useLazyQuery } from '@apollo/client';
import { Input, Table, message } from 'antd';
import { ColumnsType } from 'antd/es/table';

import { handleErrorCatch } from 'lib/utils';
import { API_OrderSearchProduct } from 'graphql/order/query';

import { OrderContext } from './OrderProvider';

import { ProductType, ProductVariationType } from 'interface/Product';

type Props = { selected: ProductType[]; onSelectProduct: Dispatch<SetStateAction<ProductType[]>> };

const OrderSearchProduct = ({ selected, onSelectProduct }: Props) => {
  const { order } = useContext(OrderContext);
  const [products, setProduct] = useState<ProductType[]>();

  const [searchProduct, { loading }] = useLazyQuery<{ product: ProductType[] }>(API_OrderSearchProduct, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    onCompleted: ({ product }) => {
      const products: ProductType[] = [];
      for (const prod of product) {
        if (prod.product_variations.every((i) => i.type === ProductVariationType.ByProduct))
          products.push(prod);
        else prod.product_variations.map((i) => products.push({ ...prod, product_variations: [i] }));
      }
      setProduct(products);
    },
    onError: handleErrorCatch,
  });

  const onSearchProduct = async (keySearch?: string) => {
    if (!keySearch || keySearch.trim().length < 2)
      message.warning('Từ khóa quá ngắn, vui lòng nhập tối thiểu 2 ký tự để tìm kiếm.');
    else await searchProduct({ variables: { name: `%${keySearch.trim()}%` } });
  };

  const onSelect = (record: ProductType, selected: boolean) => {
    if (selected) onSelectProduct((selectCurrent) => selectCurrent.concat([record]));
    else
      onSelectProduct((selectCurrent) =>
        selectCurrent.filter(
          (i) => !(i.id === record.id && i.product_variations[0].id === record.product_variations[0].id),
        ),
      );
  };

  const columns: ColumnsType<ProductType> = [
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      width: '100px',
      align: 'center',
      render: (_, { image, background_color }) => (
        <img
          src={image}
          alt=''
          style={{ width: 40, height: 40, objectFit: 'cover', background: background_color }}
        />
      ),
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Phân loại',
      dataIndex: 'product_variations',
      key: 'product_variations',
      render: (_, { product_variations }) => product_variations[0].combName,
    },
  ];

  return (
    <>
      <Input.Search
        placeholder='Nhập tên sản phẩm để tìm kiếm'
        enterButton
        style={{ marginBlock: 20 }}
        onSearch={onSearchProduct}
      />
      <Table
        rowKey={(record) => record.id + '_' + record.product_variations[0].id}
        columns={columns}
        dataSource={products}
        loading={loading}
        rowSelection={{
          type: 'checkbox',
          hideSelectAll: true,
          preserveSelectedRowKeys: true,
          selectedRowKeys: selected.map((i) => i.id + '_' + i.product_variations[0].id),
          getCheckboxProps: (record) => ({
            disabled: order.order_products.some(
              (i) => i.product_id === record.id && i.variation_id === record.product_variations[0].id,
            ),
          }),
          onSelect,
        }}
        scroll={{ y: 300 }}
        pagination={false}
      />
    </>
  );
};

export default OrderSearchProduct;
