import type { NextApiRequest, NextApiResponse } from 'next';
import { graphqlClient } from 'server/configs/graphqlClient';

import { isArrayEmpty } from 'functions';

import { OrderDetail, OrderStatus } from 'interface/Order';

export const API_GetOrderDetail = `
  query GetOrderDetail($id: Int!) {
    order(where: { id: { _eq: $id } }) {
      status
      order_products {
        id
        product_id
        variation_id
        product_info
        purchase_quantity
        delivery_quantity
      }
    }
  }
`;

export const API_CancelOrder = `
  mutation CancelOrder($orderID: Int!, $note: String!) {
    update_order(where: { id: { _eq: $orderID } }, _set: { status: 6 }) {
      affected_rows
      returning {
        status
      }
    }

    insert_order_log_one(object: { order_id: $orderID, type: 6, note: $note }) {
      type
      note
      created_at
    }

    {{update_product}}
  }
`;

const API_UpdateStock = `
  {{api_name}}: update_product_variation(where: {product_id: {_eq: {{productID}}}, id: {_eq: "{{variationID}}"}}, _inc: {stock: {{stock}}}) {
    affected_rows
  }
`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { order_id, note } = req.body;

    if (!order_id) return res.status(400).json({ error: true, message: 'Khong nhan duoc orderID' });

    const { order } = await graphqlClient.request<{ order: [OrderDetail] }>(API_GetOrderDetail, {
      id: order_id,
    });

    if (isArrayEmpty(order)) return res.status(404).json({ error: true, message: 'Order not found' });
    else if (order[0].status === OrderStatus.CANCEL)
      return res.status(400).json({ error: true, message: 'Don hang nay da bi huy' });

    const productsUpdate: string[] = order[0].order_products.map(
      ({ product_id, variation_id, purchase_quantity, delivery_quantity }, index) => {
        return API_UpdateStock.replace('{{api_name}}', 'update_stock_product_' + (index + 1))
          .replace('{{productID}}', product_id.toString())
          .replace('{{variationID}}', variation_id.toString())
          .replace('{{stock}}', (delivery_quantity ?? purchase_quantity).toString());
      },
    );

    const api = API_CancelOrder.replace('{{update_product}}', productsUpdate.join(''));
    const orderResponse = await graphqlClient.request<any>(api, { orderID: order_id, note });

    return res.status(200).json({ error: false, data: orderResponse });
  } catch (error) {
    return res.status(400).json({ error: true, message: error });
  }
}
