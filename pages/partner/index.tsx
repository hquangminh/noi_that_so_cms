import { GetServerSideProps } from 'next';
import Head from 'next/head';

import withAuth from 'lib/withAuth';
import withLayout from 'lib/withLayout';
import withApollo from 'lib/withApollo';

import PartnerListContainer from 'containers/Partner/List';

import { MenuKey } from 'interface/Layout';

const Index = () => {
  return (
    <>
      <Head>
        <title>Danh sách đối tác</title>
      </Head>
      <PartnerListContainer />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = withAuth(async (context) => {
  return { props: { auth: context.auth } };
});

export default withApollo(
  withLayout(Index, { sidebar: { openKey: [MenuKey.PARTNER], selectedKey: [MenuKey.PARTNER_LIST] } }),
);
