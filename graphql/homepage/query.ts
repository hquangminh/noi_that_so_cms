import { gql } from '@apollo/client';

export const API_GetHomepageBanners = gql`
  query GetHomepageBanners {
    homepage_banner(order_by: [{ index: asc }]) {
      id
      title
      caption
      image
      status
      index
    }
  }
`;

export const API_GetHomepageBannerDetail = gql`
  query GetHomepageBannerDetail($id: Int!) {
    homepage_banner(where: { id: { _eq: $id } }) {
      id
      title
      caption
      image
      background
      link
      status
      index
    }
  }
`;
