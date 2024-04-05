import gql from 'graphql-tag';

export const API_GetRoomType = gql`
  query {
    room_type(order_by: { name: asc }) {
      id
      name
      outstanding
      portfolio_rooms_aggregate(where: { portfolio_id: { _is_null: false } }) {
        aggregate {
          count
        }
      }
      product_rooms_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`;

export const API_CountRoomOutstanding = gql`
  query CountRoomOutstanding($non_id: Int = 0) {
    room_type_aggregate(where: { id: { _neq: $non_id }, outstanding: { _eq: true } }) {
      aggregate {
        count
      }
    }
  }
`;

export const API_GetStyleType = gql`
  query {
    style_type(order_by: { name: asc }) {
      id
      name
      outstanding
      portfolio_styles_aggregate(where: { portfolio_id: { _is_null: false } }) {
        aggregate {
          count
        }
      }
      product_styles_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`;

export const API_CountStyleOutstanding = gql`
  query CountStyleOutstanding($non_id: Int = 0) {
    style_type_aggregate(where: { id: { _neq: $non_id }, outstanding: { _eq: true } }) {
      aggregate {
        count
      }
    }
  }
`;

export const API_GetProductCategory = gql`
  query {
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
  }
`;

export const API_CheckProductCategoryIsParent = gql`
  query CheckProductCategoryIsParent($id: Int!) {
    product_category(where: { id: { _eq: $id } }) {
      product_category_relations_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`;

export const API_GetHashtag = gql`
  query GetHashtag(
    $filter: hashtag_bool_exp = {}
    $sort: [hashtag_order_by!] = [{ count: desc }, { name: asc }]
    $offset: Int = 0
    $limit: Int = 10
  ) {
    hashtag(where: $filter, order_by: $sort, limit: $limit, offset: $offset) {
      id
      name
      count
      type
      status
    }

    hashtag_aggregate(where: $filter) {
      aggregate {
        count
      }
    }
  }
`;
