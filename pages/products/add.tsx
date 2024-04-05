import { GetServerSideProps } from 'next';
import Head from 'next/head';

import withApollo from 'lib/withApollo';
import withAuth from 'lib/withAuth';
import withLayout from 'lib/withLayout';

import AddProductContainer from 'containers/Products/AddProductContainer';

import { MenuKey } from 'interface/Layout';

const Index = () => {
  return (
    <>
      <Head>
        <title>Thêm sản phẩm </title>
      </Head>
      <AddProductContainer />
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
