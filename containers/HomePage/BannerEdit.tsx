import { useRouter } from 'next/router';

import { useQuery } from '@apollo/client';
import { Spin } from 'antd';

import { API_GetHomepageBannerDetail } from 'graphql/homepage/query';

import SectionContent from 'components/Fragments/SectionContent';
import HomePageBannerForm from 'components/Pages/HomePage/BannerForm';

import { HomePageBanner } from 'interface/HomePage';

const HomePageBannerEditContainer = () => {
  const { query } = useRouter();

  const { data, loading, error } = useQuery<{ homepage_banner: HomePageBanner[] }>(
    API_GetHomepageBannerDetail,
    { variables: { id: query.recordID }, fetchPolicy: 'network-only' },
  );

  if (loading)
    return (
      <Spin spinning={loading}>
        <SectionContent>
          <div style={{ height: 300 }} />
        </SectionContent>
      </Spin>
    );

  if (error) return null;

  return <HomePageBannerForm type='edit' data={data?.homepage_banner[0]} />;
};

export default HomePageBannerEditContainer;
