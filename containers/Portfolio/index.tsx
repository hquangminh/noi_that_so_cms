import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';

import { useLazyQuery } from '@apollo/client';

import { handleErrorCatch } from 'lib/utils';
import { API_GetPortfolio } from 'graphql/portfolio/query';

import PortfolioList from 'components/Pages/Portfolio/List';
import PortfolioFilterPanel from 'components/Pages/Portfolio/FilterPanel';

import { PortfolioType } from 'interface/Portfolio';

type GqlResponse = { portfolio: PortfolioType[]; portfolio_aggregate: { aggregate: { count: number } } };
export type Filter = { name?: string; sort: string; room?: number[]; style?: number[]; page: number };

const PortfolioContainer = () => {
  const router = useRouter();

  const [fetchPortfolio, { loading, data }] = useLazyQuery<GqlResponse>(API_GetPortfolio, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    onCompleted: ({ portfolio }) => {
      if (portfolio.length === 0 && router.query.page && router.query.page !== '1') onChangePage(1);
    },
    onError: handleErrorCatch,
  });

  const onChangePage = (page?: number) =>
    router.replace({ query: { ...router.query, page } }, undefined, { shallow: true });

  const onFetchPortfolio = useCallback(() => {
    const { name = '', sort, room, style, page } = router.query;

    const sortFilter = sort?.toString()?.split('|');
    const order_by = sortFilter ? { [sortFilter[0]]: sortFilter[1] } : { name: 'asc' };

    let where: Record<string, any> = {};
    if (name) where['name'] = { _ilike: `%${name}%` };
    if (room)
      where['portfolio_rooms'] = {
        _or:
          typeof room === 'string' ? { room_id: { _eq: room } } : room.map((r) => ({ room_id: { _eq: r } })),
      };
    if (style)
      where['portfolio_styles'] = {
        _or:
          typeof style === 'string'
            ? { style_id: { _eq: style } }
            : style.map((r) => ({ style_id: { _eq: r } })),
      };

    fetchPortfolio({ variables: { where, order_by, offset: (Number(page || 1) - 1) * 10 } });
  }, [router, fetchPortfolio]);

  useEffect(() => {
    onFetchPortfolio();
  }, [onFetchPortfolio]);

  return (
    <>
      <PortfolioFilterPanel />
      <PortfolioList
        loading={loading}
        data={data?.portfolio}
        total={data?.portfolio_aggregate.aggregate.count}
        page={Number(router.query.page) || 1}
        onChangePage={onChangePage}
        onFetchData={onFetchPortfolio}
      />
    </>
  );
};

export default PortfolioContainer;
