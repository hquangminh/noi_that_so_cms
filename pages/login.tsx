import { GetServerSideProps } from 'next';
import Head from 'next/head';

import withApollo from 'lib/withApollo';

import LoginContainer from 'containers/Login';

const Index = () => {
  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <LoginContainer />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (context.req.cookies.token) return { redirect: { permanent: false, destination: '/' } };
  return { props: {} };
};

export default withApollo(Index);
