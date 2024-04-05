import { Fragment } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';

import withAuth from 'lib/withAuth';
import withApollo from 'lib/withApollo';
import withLayout from 'lib/withLayout';

import MarketingSeoEditContainer from 'containers/Marketing/SeoEdit';

import { MenuKey } from 'interface/Layout';

const Index = () => {
  return (
    <Fragment>
      <Head>
        <title>Chỉnh sửa SEO | Nội Thất Số</title>
      </Head>
      <MarketingSeoEditContainer />
    </Fragment>
  );
};

export const getServerSideProps: GetServerSideProps = withAuth(async (context) => {
  return { props: { auth: context.auth } };
});

export default withApollo(
  withLayout(Index, {
    sidebar: { openKey: [MenuKey.MARKETING], selectedKey: [MenuKey.MARKETING_SEO] },
  }),
);
