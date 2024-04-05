import { gql } from '@apollo/client';

export const API_AddHomePageBanner = gql`
  mutation AddHomePageBanner($data: homepage_banner_insert_input!) {
    insert_homepage_banner_one(object: $data) {
      id
    }
  }
`;

export const API_EditHomePageBanner = gql`
  mutation EditHomePageBanner($id: Int!, $data: homepage_banner_set_input!) {
    update_homepage_banner(where: { id: { _eq: $id } }, _set: $data) {
      returning {
        id
      }
    }
  }
`;

export const API_DeleteHomePageBanner = gql`
  mutation DeleteHomePageBanner($id: Int!) {
    delete_homepage_banner(where: { id: { _eq: $id } }) {
      returning {
        id
      }
    }
  }
`;
