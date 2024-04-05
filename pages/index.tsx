import { GetServerSideProps } from 'next';
import Head from 'next/head';

import withAuth from 'lib/withAuth';
import withApollo from 'lib/withApollo';
import withLayout from 'lib/withLayout';

import { MenuKey } from 'interface/Layout';

const Index = () => {
  return (
    <Head>
      <title>Tổng Quan | Nội Thất Số</title>
    </Head>
  );
};

export const getServerSideProps: GetServerSideProps = withAuth(async (context) => {
  return { props: { auth: context.auth } };
});

export default withApollo(withLayout(Index, { sidebar: { selectedKey: [MenuKey.DASHBOARD] } }));
