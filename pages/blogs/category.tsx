import { GetServerSideProps } from 'next';
import Head from 'next/head';

import withAuth from 'lib/withAuth';
import withLayout from 'lib/withLayout';
import withApollo from 'lib/withApollo';

import BlogCategoryContainer from 'containers/Blogs/Category';

import { MenuKey } from 'interface/Layout';

const Index = () => {
  return (
    <>
      <Head>
        <title>Danh mục Blog</title>
      </Head>

      <BlogCategoryContainer />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = withAuth(async (context) => {
  return { props: { auth: context.auth } };
});

export default withApollo(
  withLayout(Index, { sidebar: { openKey: [MenuKey.BLOG], selectedKey: [MenuKey.BLOG_CATEGORY] } }),
);
