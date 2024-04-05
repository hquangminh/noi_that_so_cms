import { useRouter } from 'next/router';

import { useQuery } from '@apollo/client';
import { Spin } from 'antd';

import { API_GetBlogDetail } from 'graphql/blog/query';

import SectionContent from 'components/Fragments/SectionContent';
import FormBlogArticle from 'components/Pages/Blogs/FormBlogArticle';

import { BlogType } from 'interface/Blog';

const EditBlogContainer = () => {
  const router = useRouter();

  const { loading, data } = useQuery<{ blog: BlogType[] }>(API_GetBlogDetail, {
    variables: { id: router.query.blogID },
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

  return <FormBlogArticle type='edit' data={data?.blog[0]} />;
};

export default EditBlogContainer;
