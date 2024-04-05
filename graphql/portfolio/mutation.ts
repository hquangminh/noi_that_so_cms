import { gql } from '@apollo/client';

export const API_AddPortfolio = gql`
  mutation ($objects: [portfolio_insert_input!]!) {
    insert_portfolio(objects: $objects) {
      returning {
        id
      }
    }
  }
`;

export const API_EditPortfolio = gql`
  mutation MyMutation(
    $portfolioID: Int!
    $rooms: [portfolio_room_insert_input!]!
    $styles: [portfolio_style_insert_input!]!
    $hashtags: [portfolio_hashtag_insert_input!] = {}
    $portfolio: portfolio_set_input!
  ) {
    delete_portfolio_room(where: { portfolio_id: { _eq: $portfolioID } }) {
      returning {
        id
      }
    }
    insert_portfolio_room(objects: $rooms) {
      returning {
        id
      }
    }

    delete_portfolio_style(where: { portfolio_id: { _eq: $portfolioID } }) {
      returning {
        id
      }
    }
    insert_portfolio_style(objects: $styles) {
      returning {
        id
      }
    }

    delete_portfolio_hashtag(where: { portfolio_id: { _eq: $portfolioID } }) {
      returning {
        id
      }
    }
    insert_portfolio_hashtag(objects: $hashtags) {
      returning {
        id
      }
    }

    update_portfolio(where: { id: { _eq: $portfolioID } }, _set: $portfolio) {
      returning {
        id
      }
    }
  }
`;

export const API_DeletePortfolio = gql`
  mutation ($id: Int!) {
    delete_portfolio(where: { id: { _eq: $id } }) {
      returning {
        id
      }
    }
  }
`;
