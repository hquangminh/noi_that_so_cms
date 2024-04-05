import type { NextApiRequest, NextApiResponse } from 'next';
import { graphqlClient } from 'server/configs/graphqlClient';

import { isArrayEmpty } from 'functions';

import { OrderDetail, OrderProductItem } from 'interface/Order';
import { ProductVariation } from 'interface/Product';

const API_CheckProductValid = `
  query CheckProductValid($filter: [product_variation_bool_exp!]!) {
    product_variation(where: {_or: $filter}) {
      id
      product_id
    }
  }
`;

const API_UpdateStock = `
  {{api_name}}: update_product_variation(where: {product_id: {_eq: {{productID}}}, id: {_eq: "{{variationID}}"}}, _inc: {stock: {{stock}}}) {
    affected_rows
  }
`;

const API_AddOrderProduct = `
  mutation AddOrderProduct($order_id: Int!, $amount: numeric!,$products: [order_product_insert_input!]!) {
    insert_order_product(objects: $products) {
      affected_rows
    }

    update_order(where: {id: {_eq: $order_id}}, _inc: {amount: $amount}) {
      returning {
        amount
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
      }
    }

    {{update_product}}
  }
`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { order_id, products }: { order_id: number; products: OrderProductItem[] } = req.body;

    if (!order_id || isArrayEmpty(products))
      return res.status(400).json({ error: true, message: 'Vui lòng kiểm tra lại BodyRequest' });

    const productsValid = await graphqlClient.request<{ product_variation: ProductVariation[] }>(
      API_CheckProductValid,
      {
        filter: products.map((prod) => ({
          product: { id: { _eq: prod.product_id }, status: { _eq: true } },
          id: { _eq: prod.variation_id },
          promotion_price: { _eq: prod.product_info.price },
          _or: [
            { stock: { _gte: prod.purchase_quantity } },
            { product: { preparation_time: { _is_null: false } } },
          ],
        })),
      },
    );

    if (productsValid.product_variation.length < products.length) {
      const invalid_products = products.filter(
        ({ product_id, variation_id }) =>
          !productsValid.product_variation.some((i) => i.product_id === product_id && i.id === variation_id),
      );
      const response = {
        error: true,
        error_code: 'INVALID_PRODUCT',
        message: 'Sản phẩm không hợp lệ',
        invalid_products,
      };
      return res.status(400).json(response);
    }

    const productsUpdate: string[] = products.map(
      ({ product_id, variation_id, purchase_quantity }, index) => {
        return API_UpdateStock.replace('{{api_name}}', 'update_stock_product_' + (index + 1))
          .replace('{{productID}}', product_id.toString())
          .replace('{{variationID}}', variation_id.toString())
          .replace('{{stock}}', '-' + purchase_quantity.toString());
      },
    );

    const order = await graphqlClient.request<{ update_order: { returning: [OrderDetail] } }>(
      API_AddOrderProduct.replace('{{update_product}}', productsUpdate.join('')),
      {
        order_id,
        products: products.map((prod) => ({ ...prod, order_id })),
        amount: products.reduce(
          (amount, prod) => (amount += prod.purchase_quantity * prod.product_info.price),
          0,
        ),
      },
    );

    res.status(200).json({ data: order.update_order.returning[0] });
  } catch (error) {
    return res.status(400).json({ error: true, message: error });
  }
}
