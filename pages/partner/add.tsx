import { GetServerSideProps } from 'next';
import Head from 'next/head';

import withAuth from 'lib/withAuth';
import withLayout from 'lib/withLayout';
import withApollo from 'lib/withApollo';

import PartnerAddContainer from 'containers/Partner/Add';

import { MenuKey } from 'interface/Layout';
import { PageProps } from 'interface/Global';

const Index = (props: PageProps) => {
  return (
    <>
      <Head>
        <title>Thêm đối tác</title>
      </Head>
      <PartnerAddContainer authName={props.auth.first_name + ' ' + props.auth.last_name} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = withAuth(async (context) => {
  return { props: { auth: context.auth } };
});

export default withApollo(
  withLayout(Index, { sidebar: { openKey: [MenuKey.PARTNER], selectedKey: [MenuKey.PARTNER_ADD] } }),
);
