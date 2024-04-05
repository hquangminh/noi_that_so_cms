import { GetServerSideProps } from 'next';
import Head from 'next/head';

import withAuth from 'lib/withAuth';
import withLayout from 'lib/withLayout';
import withApollo from 'lib/withApollo';

import PartnerViewContainer from 'containers/Partner/View';

import { MenuKey } from 'interface/Layout';

const Index = () => {
  return (
    <>
      <Head>
        <title>Chi tiết đối tác</title>
      </Head>
      <PartnerViewContainer />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = withAuth(async (context) => {
  return { props: { auth: context.auth } };
});

export default withApollo(withLayout(Index, { sidebar: { selectedKey: [MenuKey.PARTNER] } }));
