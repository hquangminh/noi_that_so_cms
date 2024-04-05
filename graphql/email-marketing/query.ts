import { gql } from '@apollo/client';

export const API_EmailMarketing = gql`
  query EmailMarketing($status: Int_comparison_exp = {}, $offset: Int = 0) {
    email_marketing(where: { status: $status }, order_by: { created_at: desc }, limit: 10, offset: $offset) {
      id
      name
      creator
      created_at
    }
  }
`;

export const API_EmailMarketingDetail = gql`
  query ($id: Int!) {
    email_marketing(where: { id: { _eq: $id } }) {
      id
      design
      html
      status
      creator
      created_at
    }
  }
`;
