import { gql } from '@apollo/client';

export const API_AddSeoPage = gql`
  mutation AddSeoPage($data: seo_page_insert_input!) {
    insert_seo_page_one(object: $data) {
      id
    }
  }
`;

export const API_EditSeoPage = gql`
  mutation EditSeoPage($id: Int!, $data: seo_page_set_input!) {
    update_seo_page(where: { id: { _eq: $id } }, _set: $data) {
      returning {
        id
      }
    }
  }
`;

export const API_DeleteSeoPage = gql`
  mutation DeleteSeoPage($id: Int!) {
    delete_seo_page(where: { id: { _eq: $id } }) {
      returning {
        id
        image
      }
    }
  }
`;
