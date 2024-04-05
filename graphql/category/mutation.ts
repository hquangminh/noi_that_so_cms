import gql from 'graphql-tag';

// Room Category
export const API_AddRoomType = gql`
  mutation ($data: room_type_insert_input!) {
    insert_room_type_one(object: $data) {
      id
    }
  }
`;

export const API_EditRoomType = gql`
  mutation ($id: Int!, $data: room_type_set_input!) {
    update_room_type(where: { id: { _eq: $id } }, _set: $data) {
      returning {
        id
      }
    }
  }
`;

export const API_DeleteRoomType = gql`
  mutation ($id: Int!) {
    delete_room_type(where: { id: { _eq: $id } }) {
      returning {
        id
      }
    }
  }
`;

// Style Category
export const API_AddStyleType = gql`
  mutation ($data: style_type_insert_input!) {
    insert_style_type_one(object: $data) {
      id
    }
  }
`;

export const API_EditStyleType = gql`
  mutation ($id: Int!, $data: style_type_set_input!) {
    update_style_type(where: { id: { _eq: $id } }, _set: $data) {
      returning {
        id
      }
    }
  }
`;

export const API_DeleteStyleType = gql`
  mutation ($id: Int!) {
    delete_style_type(where: { id: { _eq: $id } }) {
      returning {
        id
      }
    }
  }
`;

// Product Category
export const API_AddProductCategory = gql`
  mutation ($objects: [product_category_insert_input!]!) {
    insert_product_category(objects: $objects) {
      returning {
        id
      }
    }
  }
`;

export const API_EditProductCategory = gql`
  mutation ($id: Int!, $_set: product_category_set_input!, $_setChild: product_category_set_input = {}) {
    update_product_category(where: { id: { _eq: $id } }, _set: $_set) {
      returning {
        id
      }
    }

    update_product_category_child: update_product_category(
      where: { parent_id: { _eq: $id } }
      _set: $_setChild
    ) {
      returning {
        id
      }
    }
  }
`;

export const API_DeleteProductCategory = gql`
  mutation ($id: Int!) {
    delete_product_category(where: { id: { _eq: $id } }) {
      returning {
        id
      }
    }
  }
`;

// Hashtag
export const API_AddHashtag = gql`
  mutation AddHashtag($data: hashtag_insert_input!) {
    insert_hashtag_one(object: $data) {
      id
    }
  }
`;

export const API_EditHashtag = gql`
  mutation EditHashtag($data: hashtag_set_input!, $id: Int!) {
    update_hashtag(where: { id: { _eq: $id } }, _set: $data) {
      returning {
        id
      }
    }
  }
`;

export const API_DeleteHashtag = gql`
  mutation DeleteHashtag($id: Int!) {
    delete_hashtag(where: { id: { _eq: $id } }) {
      affected_rows
    }
  }
`;
