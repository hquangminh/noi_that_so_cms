import { gql } from '@apollo/client';

export const API_AddPartner = gql`
  mutation MyMutation($data: partner_insert_input!) {
    insert_partner_one(object: $data) {
      id
    }
  }
`;

export const API_PartnerReject = gql`
  mutation ($id: Int!, $note: String!) {
    update_partner(where: { id: { _eq: $id } }, _set: { status: 3, note: $note }) {
      returning {
        id
      }
    }
  }
`;

export const API_PartnerApprove = gql`
  mutation ($id: Int!, $data: partner_set_input = { status: 2 }) {
    update_partner(where: { id: { _eq: $id } }, _set: $data) {
      returning {
        id
      }
    }
  }
`;
