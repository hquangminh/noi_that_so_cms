import type { NextApiRequest, NextApiResponse } from 'next';
import { graphqlClient } from 'server/configs/graphqlClient';

import { isArrayEmpty } from 'functions';

import { OrderDetail, OrderStatus } from 'interface/Order';
import { ProductVariation } from 'interface/Product';

const API_GetOrderDetail = `
  query GetOrderDetail($id: Int!) {
    order(where: { id: { _eq: $id } }) {
      status
      order_products {
        id
        product_id
        variation_id
        purchase_quantity
        delivery_quantity
        product_info
        product {
          preparation_time
        }
      }
    }
  }
`;

const API_CheckStock = `
  query MyQuery ($filter: [product_variation_bool_exp!]!) {
    product_variation(where: {_or: $filter}) {
      id
      product_id
    }
  }
`;

const API_UpdateProductOrder = `
  mutation UpdateProductOrder($orderID: Int!, $amount: numeric!) {
    {{update_quantity}}
    {{update_stock}}

    update_order(where: { id: { _eq: $orderID } }, _set: { amount: $amount }) {
      affected_rows
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
  }
`;

const API_UpdateQuantity = `
  {{api_name}}: update_order_product(where: {id: {_eq: {{order_product_id}}}}, _set: {delivery_quantity: {{quantity}}}) {
    affected_rows
  }
`;

const API_UpdateStock = `
  {{api_name}}: update_product_variation(where: {product_id: {_eq: {{productID}}}, id: {_eq: "{{variationID}}"}}, _inc: {stock: {{stock}}}) {
    affected_rows
  }
`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { order_id, products } = req.body;
    const product_list: { id: number; quantity: number }[] = products;

    if (!order_id || isArrayEmpty(products))
      return res.status(400).json({ error: true, message: 'Giá trị đầu vào không chính xác' });

    const { order } = await graphqlClient.request<{ order: [OrderDetail] }>(API_GetOrderDetail, {
      id: order_id,
    });

    if (isArrayEmpty(order)) return res.status(404).json({ error: true, message: 'Order not found' });
    else if (order[0].status === OrderStatus.CANCEL)
      return res.status(400).json({ error: true, message: 'Don hang nay da bi huy' });

    const filterStock = product_list.map(({ id, quantity: new_quantity }) => {
      const product = order[0].order_products.find((i) => i.id === id);
      if (product) {
        const { product_id, variation_id, purchase_quantity, delivery_quantity } = product;
        const stockUpdate = (delivery_quantity ?? purchase_quantity) - new_quantity;
        if (stockUpdate < 0)
          return {
            product_id: { _eq: product_id },
            id: { _eq: variation_id },
            _or: [
              { stock: { _gte: Math.abs(stockUpdate).toString() } },
              { product: { preparation_time: { _is_null: false } } },
            ],
          };
      }
    });
    const { product_variation } = await graphqlClient.request<{ product_variation: ProductVariation[] }>(
      API_CheckStock,
      { filter: filterStock.filter((i) => i) },
    );
    const productsInvalidStock = filterStock.filter(
      (i) => !product_variation.some((v) => v.product_id === i?.product_id._eq && v.id === i.id._eq),
    );
    const invalidProduct = productsInvalidStock.map((i) =>
      order[0].order_products.find((p) => p.product_id === i?.product_id._eq && p.variation_id === i.id._eq),
    );
    if (!isArrayEmpty(invalidProduct.filter((i) => i)))
      return res.status(404).json({
        error: true,
        error_code: 'ORDER_UPDATE_QUANTITY_INVALID_PRODUCT',
        message: 'Một vài sản phẩm không đủ tồn kho để giao hàng',
        invalid_products: invalidProduct.filter((i) => i),
      });

    const updateQuantity: string[] = product_list.map(({ id, quantity }, index) => {
      return API_UpdateQuantity.replace('{{api_name}}', 'update_stock_product_' + (index + 1))
        .replace('{{order_product_id}}', id.toString())
        .replace('{{quantity}}', quantity.toString());
    });

    const updateStock: string[] = product_list.map(({ id, quantity: new_quantity }, index) => {
      const product = order[0].order_products.find((i) => i.id === id);
      if (!product || product.product.preparation_time !== null) return '';
      else {
        const { product_id, variation_id, purchase_quantity, delivery_quantity } = product;
        return API_UpdateStock.replace('{{api_name}}', 'update_product_quantity_' + (index + 1))
          .replace('{{productID}}', product_id.toString())
          .replace('{{variationID}}', variation_id.toString())
          .replace('{{stock}}', ((delivery_quantity ?? purchase_quantity) - new_quantity).toString());
      }
    });

    const amount = order[0].order_products.reduce((total, prod) => {
      const price = prod.product_info.price;
      const quantity = product_list.find((i) => i.id === prod.id)?.quantity;
      return (total += price * (quantity ?? prod.delivery_quantity ?? prod.purchase_quantity));
    }, 0);

    const api = API_UpdateProductOrder.replace('{{update_quantity}}', updateQuantity.join('')).replace(
      '{{update_stock}}',
      updateStock.join(''),
    );
    const orderResponse = await graphqlClient.request<any>(api, { orderID: order_id, amount });

    return res.status(200).json({ error: false, data: orderResponse });
  } catch (error) {
    return res.status(400).json({ error: true, message: error });
  }
}
