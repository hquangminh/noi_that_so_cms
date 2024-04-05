import { gql } from '@apollo/client';

export const API_GetOrder = gql`
  query GetOrder($filter: order_bool_exp = {}, $sort: [order_order_by!]!, $offset: Int = 0) {
    order(where: $filter, order_by: $sort, limit: 10, offset: $offset) {
      id
      order_no
      amount
      status
      order_delivery {
        name
      }
      order_products(limit: 2) {
        purchase_quantity
        delivery_quantity
        product_info
      }
      products_aggregate: order_products_aggregate(
        where: { purchase_quantity: { _gte: 0 }, delivery_quantity: { _is_null: true } }
      ) {
        aggregate {
          count
          sum {
            purchase_quantity
          }
        }
      }
      products_update_aggregate: order_products_aggregate(where: { delivery_quantity: { _gte: 0 } }) {
        aggregate {
          count
          sum {
            delivery_quantity
          }
        }
      }
    }

    order_aggregate(where: $filter) {
      aggregate {
        count
      }
    }
  }
`;

export const API_GetOrderDetail = gql`
  query GetOrderDetail($id: Int!) {
    order(where: { id: { _eq: $id } }) {
      id
      order_no
      amount
      status
      referrer {
        name
        code
      }
      order_delivery {
        name
        phone
        email
        street
        district
        ward
        city
        note
      }
      order_products {
        id
        product_id
        variation_id
        purchase_quantity
        delivery_quantity
        product_info
        product {
          partner {
            name
          }
        }
      }
      order_notes(order_by: { created_at: asc }) {
        id
        note
        created_at
        updated_at
      }
      order_logs(order_by: { id: desc }) {
        id
        type
        note
        created_at
      }
    }
  }
`;

export const API_OrderSearchProduct = gql`
  query OrderSearchProduct($name: String!) {
    product(
      where: {
        status: { _eq: true }
        name: { _ilike: $name }
        _or: [{ product_variations: { stock: { _gt: "0" } } }, { preparation_time: { _is_null: false } }]
      }
      order_by: { name: asc }
    ) {
      id
      name
      image
      background_color
      status
      preparation_time
      product_variations(
        where: { _or: [{ stock: { _gt: "0" } }, { product: { preparation_time: { _is_null: false } } }] }
      ) {
        id
        combName
        price
        promotion_price
        sku
        stock
        type
      }
    }
  }
`;
