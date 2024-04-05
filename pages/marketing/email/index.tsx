import { Fragment } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';

import withAuth from 'lib/withAuth';
import withApollo from 'lib/withApollo';
import withLayout from 'lib/withLayout';

import { MenuKey } from 'interface/Layout';
import MailListContainer from 'containers/Marketing/MailList';

const Index = () => {
  return (
    <Fragment>
      <Head>
        <title>Email quảng cáo | Nội Thất Số</title>
      </Head>
      <MailListContainer />
    </Fragment>
  );
};

export const getServerSideProps: GetServerSideProps = withAuth(async (context) => {
  return { props: { auth: context.auth } };
});

export default withApollo(
  withLayout(Index, {
    sidebar: { openKey: [MenuKey.MARKETING], selectedKey: [MenuKey.MARKETING_SEND_MAIL] },
  }),
);
