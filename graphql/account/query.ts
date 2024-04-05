import gql from 'graphql-tag';

export const API_Account = gql`
  query {
    account(order_by: { id: asc }) {
      id
      username
      first_name
      last_name
    }
  }
`;

export const API_AccountDetail = gql`
  query MyQuery($id: Int!) {
    account(where: { id: { _eq: $id } }) {
      id
      username
      first_name
      last_name
    }
  }
`;
