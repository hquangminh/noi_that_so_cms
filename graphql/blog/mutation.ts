import { gql } from '@apollo/client';

export const API_AddBlogCategory = gql`
  mutation ($objects: [blog_category_insert_input!]!) {
    insert_blog_category(objects: $objects) {
      returning {
        id
      }
    }
  }
`;

export const API_EditBlogCategory = gql`
  mutation ($id: Int!, $set: blog_category_set_input!, $update_blog: blog_set_input = {}) {
    update_blog_category(where: { id: { _eq: $id } }, _set: $set) {
      returning {
        id
      }
    }

    update_blog(where: { category_id: { _eq: $id } }, _set: $update_blog) {
      returning {
        id
      }
    }
  }
`;

export const API_DeleteBlogCategory = gql`
  mutation ($id: Int!) {
    delete_blog_category(where: { id: { _eq: $id } }) {
      returning {
        id
      }
    }
  }
`;

export const API_AddBlog = gql`
  mutation ($objects: [blog_insert_input!]!) {
    insert_blog(objects: $objects) {
      returning {
        id
      }
    }
  }
`;

export const APT_EditBlog = gql`
  mutation (
    $id: Int!
    $_set: blog_set_input!
    $hashtags: [blog_hashtag_insert_input!] = {}
    $product: [blog_product_insert_input!] = []
  ) {
    delete_blog_product(where: { blog_id: { _eq: $id } }) {
      returning {
        id
      }
    }
    insert_blog_product(objects: $product) {
      returning {
        id
      }
    }

    delete_blog_hashtag(where: { blog_id: { _eq: $id } }) {
      returning {
        id
      }
    }
    insert_blog_hashtag(objects: $hashtags) {
      returning {
        id
      }
    }

    update_blog(where: { id: { _eq: $id } }, _set: $_set) {
      returning {
        id
      }
    }
  }
`;

export const APT_DeleteBlog = gql`
  mutation ($id: Int!) {
    delete_blog(where: { id: { _eq: $id } }) {
      returning {
        image
      }
    }
  }
`;
