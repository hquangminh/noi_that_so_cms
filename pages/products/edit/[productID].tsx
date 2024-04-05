import { GetServerSideProps } from 'next';
import Head from 'next/head';

import withApollo from 'lib/withApollo';
import withAuth from 'lib/withAuth';
import withLayout from 'lib/withLayout';

import EditProductContainer from 'containers/Products/EditProductContainer';

import { MenuKey } from 'interface/Layout';

const Index = () => {
  return (
    <>
      <Head>
        <title>Chỉnh sửa sản phẩm </title>
      </Head>
      <EditProductContainer />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = withAuth(async (context) => {
  return { props: { auth: context.auth } };
});

export default withApollo(
  withLayout(Index, {
    sidebar: { openKey: [MenuKey.PRODUCT], selectedKey: [MenuKey.PRODUCT_ADD] },
  }),
);
