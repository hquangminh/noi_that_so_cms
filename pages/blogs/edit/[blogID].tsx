import { GetServerSideProps } from 'next';
import Head from 'next/head';

import withAuth from 'lib/withAuth';
import withLayout from 'lib/withLayout';
import withApollo from 'lib/withApollo';

import EditBlogContainer from 'containers/Blogs/Edit';

import { MenuKey } from 'interface/Layout';

const Index = () => {
  return (
    <>
      <Head>
        <title>Chỉnh sửa bài viết Blog</title>
      </Head>

      <EditBlogContainer />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = withAuth(async (context) => {
  return { props: { auth: context.auth } };
});

export default withApollo(withLayout(Index, { sidebar: { openKey: [MenuKey.BLOG] } }));
