import { gql } from '@apollo/client';

export const API_GetDataFilter = gql`
  query GetDataFilter {
    product_category(order_by: { name: asc }) {
      id
      name
      parent_id
    }

    partner(where: { status: { _eq: 2 } }, order_by: { name: asc }) {
      id
      name
    }
  }
`;

export const API_GetProduct = gql`
  query ($where: product_bool_exp, $sort: [product_order_by!] = { name: asc }, $offset: Int = 0) {
    product(where: $where, offset: $offset, limit: 10, order_by: $sort) {
      id
      name
      image
      background_color
      status
      preparation_time
      product_variations {
        combName
        combUnicode
        price
        sku
        stock
        type
      }
    }

    product_aggregate(where: $where) {
      aggregate {
        count
      }
    }

    product_variation_aggregate(where: { product: $where }) {
      aggregate {
        count
      }
    }
  }
`;

export const API_GetProductDetail = gql`
  query GetProductDetail($id: Int!) {
    product(where: { id: { _eq: $id } }) {
      id
      name
      image
      background_color
      description
      preparation_time
      material
      status
      product_category_relations {
        category_id
      }
      product_rooms {
        room_id
      }
      product_styles {
        style_id
      }
      product_hashtags {
        hashtag_id
      }
      partner {
        id
      }
      product_options(order_by: { index: asc }) {
        id
        index
        name
        options
      }
      product_variations(order_by: { combUnicode: asc }) {
        id
        combName
        combUnicode
        link
        price
        promotion_price
        size
        sku
        stock
        type
      }
      order_products_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`;

export const API_GetProductForAttachment = gql`
  query ($name: String = "%%") {
    product(where: { name: { _ilike: $name }, status: { _eq: true } }) {
      id
      name
      image
    }
  }
`;

export const API_GetCategoryHashtagPartner = gql`
  query GetCategoryHashtagPartner {
    product_category(order_by: { name: asc }) {
      id
      name
      parent_id
      status
      product_category_relations_aggregate {
        aggregate {
          count
        }
      }
    }

    room_type(order_by: { name: asc }) {
      id
      name
      outstanding
      portfolio_rooms_aggregate(where: { portfolio_id: { _is_null: false } }) {
        aggregate {
          count
        }
      }
    }

    style_type(order_by: { name: asc }) {
      id
      name
      outstanding
      portfolio_styles_aggregate(where: { portfolio_id: { _is_null: false } }) {
        aggregate {
          count
        }
      }
    }

    hashtag(where: { type: { _eq: 1 } }, order_by: [{ count: desc }, { name: asc }]) {
      id
      name
    }

    partner(where: { status: { _eq: 2 } }, order_by: { updated_at: desc }) {
      id
      name
      logo
    }
  }
`;
