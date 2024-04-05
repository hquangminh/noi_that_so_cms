import gql from 'graphql-tag';

export const API_AddAccount = gql`
  mutation ($objects: [account_insert_input!]!) {
    insert_account(objects: $objects) {
      returning {
        id
      }
    }
  }
`;

export const API_EditAccount = gql`
  mutation MyMutation($id: Int!, $set: account_set_input!) {
    update_account(where: { id: { _eq: $id } }, _set: $set) {
      returning {
        id
      }
    }
  }
`;

export const API_DeleteAccount = gql`
  mutation ($id: Int!) {
    delete_account(where: { id: { _eq: $id } }) {
      returning {
        id
      }
    }
  }
`;
