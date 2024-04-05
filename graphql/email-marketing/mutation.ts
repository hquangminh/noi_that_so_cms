import { gql } from '@apollo/client';

export const API_AddEmailMarketing = gql`
  mutation ($data: email_marketing_insert_input!) {
    insert_email_marketing_one(object: $data) {
      id
    }
  }
`;

export const API_EditEmailMarketing = gql`
  mutation ($data: email_marketing_set_input!, $id: Int!) {
    update_email_marketing(where: { id: { _eq: $id } }, _set: $data) {
      returning {
        id
      }
    }
  }
`;
