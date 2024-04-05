import { useRouter } from 'next/router';

import { useQuery } from '@apollo/client';
import { Spin } from 'antd';

import { API_GetProductDetail } from 'graphql/product/query';

import SectionContent from 'components/Fragments/SectionContent';
import FormProductComponent from 'components/Pages/Product/Form';

import { ProductDetail } from 'interface/Product';

const EditProductContainer = () => {
  const router = useRouter();

  const { data, loading } = useQuery<{ product: ProductDetail[] }>(API_GetProductDetail, {
    variables: { id: router.query.productID },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });

  if (loading)
    return (
      <Spin spinning={loading}>
        <SectionContent>
          <div style={{ height: 300 }} />
        </SectionContent>
      </Spin>
    );

  return <FormProductComponent type='edit' data={data?.product[0]} />;
};

export default EditProductContainer;
