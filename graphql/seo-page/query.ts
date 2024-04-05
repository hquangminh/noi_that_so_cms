import { gql } from '@apollo/client';

export const API_GetSeoPage = gql`
  query GetSeoPage {
    seo_page(order_by: { page: asc }) {
      id
      page
      image
      title
      description
      keyword
    }
  }
`;

export const API_GetSeoPageDetail = gql`
  query GetSeoPageDetail($id: Int!) {
    seo_page(where: { id: { _eq: $id } }) {
      id
      page
      image
      title
      description
      keyword
    }
  }
`;
