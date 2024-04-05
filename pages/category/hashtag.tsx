import { GetServerSideProps } from 'next';
import Head from 'next/head';

import withAuth from 'lib/withAuth';
import withLayout from 'lib/withLayout';
import withApollo from 'lib/withApollo';

import CategoryHashtagContainer from 'containers/Category/Hashtag';

import { MenuKey } from 'interface/Layout';

const Index = () => {
  return (
    <>
      <Head>
        <title>Hashtag</title>
      </Head>
      <CategoryHashtagContainer />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = withAuth(async (context) => {
  return { props: { auth: context.auth } };
});

export default withApollo(
  withLayout(Index, { sidebar: { openKey: [MenuKey.CATEGORY], selectedKey: [MenuKey.CATEGORY_HASHTAG] } }),
);
