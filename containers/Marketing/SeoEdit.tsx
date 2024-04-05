import { useRouter } from 'next/router';

import { useQuery } from '@apollo/client';
import { Spin } from 'antd';

import { API_GetSeoPageDetail } from 'graphql/seo-page/query';

import SectionContent from 'components/Fragments/SectionContent';
import MarketingSeoForm from 'components/Pages/Marketing/SeoForm';

import { SeoPageType } from 'interface/SeoPage';

const MarketingSeoEditContainer = () => {
  const router = useRouter();

  const { data, loading } = useQuery<{ seo_page: SeoPageType[] }>(API_GetSeoPageDetail, {
    variables: { id: router.query.seoID },
  });

  if (loading)
    return (
      <SectionContent>
        <Spin>
          <div style={{ height: 300 }} />
        </Spin>
      </SectionContent>
    );

  return <MarketingSeoForm type='edit' data={data?.seo_page[0]} />;
};

export default MarketingSeoEditContainer;
