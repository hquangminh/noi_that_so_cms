import { gql } from '@apollo/client';

export const API_GetPortfolio = gql`
  query (
    $where: portfolio_bool_exp = {}
    $offset: Int = 0
    $order_by: [portfolio_order_by!] = { name: "asc" }
  ) {
    portfolio(where: $where, order_by: $order_by, limit: 10, offset: $offset) {
      id
      name
      image
    }

    portfolio_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;

export const API_GetPortfolioDetail = gql`
  query ($id: Int!) {
    portfolio(where: { id: { _eq: $id } }) {
      id
      name
      image
      portfolio_link
      seo_title
      seo_description
      portfolio_rooms {
        room_id
      }
      portfolio_styles {
        style_id
      }
      portfolio_hashtags {
        hashtag_id
      }
    }
  }
`;
