import { useRouter } from 'next/router';

import { useQuery } from '@apollo/client';
import { Spin } from 'antd';

import { API_GetPortfolioDetail } from 'graphql/portfolio/query';

import SectionContent from 'components/Fragments/SectionContent';
import PortfolioForm from 'components/Pages/Portfolio/Form';

import { PortfolioDetail } from 'interface/Portfolio';

const EditPortfolioContainer = () => {
  const router = useRouter();

  const { loading, data } = useQuery<{ portfolio: PortfolioDetail[] }>(API_GetPortfolioDetail, {
    variables: { id: router.query.portfolioID },
    fetchPolicy: 'cache-and-network',
  });

  if (loading)
    return (
      <Spin spinning={loading}>
        <SectionContent>
          <div style={{ height: 300 }} />
        </SectionContent>
      </Spin>
    );

  return <PortfolioForm type='edit' data={data?.portfolio[0]} />;
};

export default EditPortfolioContainer;
