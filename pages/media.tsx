import { Fragment } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';

import withAuth from 'lib/withAuth';
import withApollo from 'lib/withApollo';
import withLayout from 'lib/withLayout';

import MediaContainer from 'containers/Media';

import { MenuKey } from 'interface/Layout';

const Index = () => {
  return (
    <Fragment>
      <Head>
        <title>Tổng Quan | Nội Thất Số</title>
      </Head>
      <MediaContainer />
    </Fragment>
  );
};

export const getServerSideProps: GetServerSideProps = withAuth(async (context) => {
  return { props: { auth: context.auth } };
});

export default withApollo(withLayout(Index, { sidebar: { selectedKey: [MenuKey.DASHBOARD] } }));
