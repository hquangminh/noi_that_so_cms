import { Fragment } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';

import { useQuery } from '@apollo/client';

import withAuth from 'lib/withAuth';
import withLayout from 'lib/withLayout';
import withApollo from 'lib/withApollo';

import { API_GetOrderDetail } from 'graphql/order/query';

import OrderProvider from 'components/Pages/Order/OrderProvider';
import OrderDetailContainer from 'containers/Order/Detail';

import { MenuKey } from 'interface/Layout';
import { OrderDetail } from 'interface/Order';

const Index = () => {
  const { query } = useRouter();
  const { data, loading } = useQuery<{ order: [OrderDetail] }>(API_GetOrderDetail, {
    variables: { id: query.orderID },
    fetchPolicy: 'network-only',
  });

  if (loading)
    return (
      <Fragment>
        <Head>
          <title>Đang tải...</title>
        </Head>
      </Fragment>
    );

  if (!data) return null;

  return (
    <>
      <Head>
        <title>{data.order[0].order_no}</title>
      </Head>
      <OrderProvider order={data.order[0]}>
        <OrderDetailContainer />
      </OrderProvider>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = withAuth(async (context) => {
  return { props: { auth: context.auth } };
});

export default withApollo(
  withLayout(Index, { sidebar: { openKey: [MenuKey.ORDER], selectedKey: [MenuKey.ORDER] } }),
);
