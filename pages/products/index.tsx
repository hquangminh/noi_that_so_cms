import { GetServerSideProps } from 'next';
import Head from 'next/head';

import withAuth from 'lib/withAuth';
import withLayout from 'lib/withLayout';

import ProductListContainer from 'containers/Products/List';

import { MenuKey } from 'interface/Layout';
import withApollo from 'lib/withApollo';

const Index = () => {
  return (
    <>
      <Head>
        <title>Tất cả sản phẩm</title>
      </Head>
      <ProductListContainer />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = withAuth(async (context) => {
  return { props: { auth: context.auth } };
});

export default withApollo(
  withLayout(Index, { sidebar: { openKey: [MenuKey.PRODUCT], selectedKey: [MenuKey.PRODUCT_LIST] } }),
);
