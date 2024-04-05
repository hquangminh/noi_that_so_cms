import { gql } from '@apollo/client';

export const API_GetPartner = gql`
  query ($status: Int!, $name: String = "%%") {
    partner(where: { name: { _ilike: $name }, status: { _eq: $status } }, order_by: { updated_at: desc }) {
      id
      name
      logo
      phone_number
      created_at
    }
  }
`;

export const API_GetPartnerDetail = gql`
  query ($id: Int!) {
    partner(where: { id: { _eq: $id } }) {
      id
      name
      logo
      email
      phone_number
      website
      registrant_name
      status
      created_at
    }
  }
`;
