import { gql } from '@apollo/client';

export const API_AddProduct = gql`
  mutation ($objects: [product_insert_input!]!) {
    insert_product(objects: $objects) {
      returning {
        id
      }
    }
  }
`;

export const API_EditProduct = gql`
  mutation EditProduct(
    $productID: Int!
    $product: product_set_input!
    $category: [product_category_relation_insert_input!]!
    $room: [product_room_insert_input!] = {}
    $style: [product_style_insert_input!] = {}
    $hashtag: [product_hashtag_insert_input!] = {}
    $option: [product_option_insert_input!] = {}
    $variation: [product_variation_insert_input!] = {}
  ) {
    delete_product_category_relation(where: { product_id: { _eq: $productID } }) {
      returning {
        id
      }
    }
    insert_product_category_relation(objects: $category) {
      returning {
        id
      }
    }

    delete_product_room(where: { product_id: { _eq: $productID } }) {
      returning {
        id
      }
    }
    insert_product_room(objects: $room) {
      returning {
        id
      }
    }

    delete_product_style(where: { product_id: { _eq: $productID } }) {
      returning {
        id
      }
    }
    insert_product_style(objects: $style) {
      returning {
        id
      }
    }

    delete_product_hashtag(where: { product_id: { _eq: $productID } }) {
      affected_rows
    }
    insert_product_hashtag(objects: $hashtag) {
      returning {
        id
      }
    }

    delete_product_option(where: { product_id: { _eq: $productID } }) {
      returning {
        id
      }
    }
    insert_product_option(objects: $option) {
      returning {
        id
      }
    }

    delete_product_variation(where: { product_id: { _eq: $productID } }) {
      returning {
        id
      }
    }
    insert_product_variation(objects: $variation) {
      returning {
        id
      }
    }

    update_product(where: { id: { _eq: $productID } }, _set: $product) {
      returning {
        id
      }
    }
  }
`;

export const API_DeleteProduct = gql`
  mutation ($productID: Int!) {
    delete_product(where: { id: { _eq: $productID } }) {
      returning {
        id
        image
      }
    }
  }
`;
