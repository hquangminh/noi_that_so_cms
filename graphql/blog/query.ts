import gql from 'graphql-tag';

export const API_GetBlogCategory = gql`
  query {
    blog_category(order_by: { name: asc }) {
      id
      name
      status
    }
  }
`;

export const API_GetBlogCategoryActive = gql`
  query {
    blog_category(where: { status: { _eq: true } }, order_by: { name: asc }) {
      id
      name
      status
    }
  }
`;

export const API_CheckBlogCategoryActive = gql`
  query ($id: Int!) {
    blog_category(where: { id: { _eq: $id }, status: { _eq: true } }) {
      id
    }
  }
`;

export const API_CountBlogByCategory = gql`
  query ($cateID: Int!) {
    blog_aggregate(where: { category_id: { _eq: $cateID } }) {
      aggregate {
        count
      }
    }
  }
`;

export const API_GetBlog = gql`
  query ($where: blog_bool_exp!, $offset: Int = 0) {
    blog(where: $where, order_by: { title: asc }, offset: $offset, limit: 10) {
      id
      title
      image
      status
      created_at
      blog_category {
        name
      }
    }
    blog_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;

export const API_GetBlogDetail = gql`
  query ($id: Int!) {
    blog(where: { id: { _eq: $id } }) {
      id
      title
      summary
      content
      image
      status
      publish_date
      category_id
      blog_products {
        product {
          id
          name
          image
        }
      }
      blog_hashtags {
        hashtag_id
      }
      seo_title
      seo_description
    }
  }
`;
