import { Fragment } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';

import withAuth from 'lib/withAuth';
import withApollo from 'lib/withApollo';
import withLayout from 'lib/withLayout';

import MarketingMailTemplateDetailContainer from 'containers/Marketing/MailTempleteDetail';

import { MenuKey } from 'interface/Layout';
import { PageProps } from 'interface/Global';

const Index = (props: PageProps) => {
  return (
    <Fragment>
      <Head>
        <title>Biên tập email quảng cáo | Nội Thất Số</title>
      </Head>
      <MarketingMailTemplateDetailContainer auth={props.auth} />
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
