import { gql } from '@apollo/client';

export const APT_GetSubscribe = gql`
  query {
    subscribe {
      email
    }
  }
`;
