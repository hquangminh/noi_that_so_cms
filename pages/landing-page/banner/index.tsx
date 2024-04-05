import { Fragment } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';

import withAuth from 'lib/withAuth';
import withLayout from 'lib/withLayout';
import withApollo from 'lib/withApollo';

import BannerListContainer from 'containers/HomePage/BannerList';

import { MenuKey } from 'interface/Layout';

const Index = () => {
  return (
    <Fragment>
      <Head>
        <title>Banner</title>
      </Head>
      <BannerListContainer />
    </Fragment>
  );
};

export const getServerSideProps: GetServerSideProps = withAuth(async (context) => {
  return { props: { auth: context.auth } };
});

export default withApollo(
  withLayout(Index, {
    sidebar: { openKey: [MenuKey.LANDING_PAGE], selectedKey: [MenuKey.LANDING_PAGE_BANNER] },
  }),
);
