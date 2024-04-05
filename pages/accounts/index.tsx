import { GetServerSideProps } from 'next';
import Head from 'next/head';

import withAuth from 'lib/withAuth';
import withLayout from 'lib/withLayout';
import withApollo from 'lib/withApollo';

import ListAccount from 'containers/Accounts/List';

import { MenuKey } from 'interface/Layout';

const Index = () => {
  return (
    <>
      <Head>
        <title>Danh sách quản trị viên</title>
      </Head>
      <ListAccount />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = withAuth(async (context) => {
  return { props: { auth: context.auth } };
});

export default withApollo(withLayout(Index, { sidebar: { selectedKey: [MenuKey.ACCOUNT] } }));
