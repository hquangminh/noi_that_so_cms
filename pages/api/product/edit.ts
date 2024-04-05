// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

import { gql } from 'graphql-request';

import { graphqlClient } from 'server/configs/graphqlClient';
import { isArrayEmpty } from 'functions';

import { ProductDetail, ProductVariation } from 'interface/Product';
import { OrderStatus } from 'interface/Order';

const API_GetProductDetail = gql`
  query ($id: Int!) {
    product(where: { id: { _eq: $id } }) {
      product_variations(order_by: { combUnicode: asc }) {
        id
        combUnicode
      }
    }
  }
`;

const API_UpdateCategory = `
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
`;

const API_UpdateRoom = `
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
`;

const API_UpdateStyle = `
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
`;

const API_UpdateHashtag = `
  delete_product_hashtag(where: { product_id: { _eq: $productID } }) {
    affected_rows
  }
  insert_product_hashtag(objects: $hashtag) {
    returning {
      id
    }
  }
`;

const API_UpdateOption = `
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
`;

const API_EditProduct = gql`
  mutation EditProduct(
    $productID: Int!
    $product: product_set_input!
    $category: [product_category_relation_insert_input!]!
    $room: [product_room_insert_input!] = {}
    $style: [product_style_insert_input!] = {}
    $hashtag: [product_hashtag_insert_input!] = {}
    $option: [product_option_insert_input!] = {}
  ) {
    update_product(where: { id: { _eq: $productID } }, _set: $product) {
      returning {
        id
      }
    }

    ${API_UpdateCategory}
    ${API_UpdateRoom}
    ${API_UpdateStyle}
    ${API_UpdateHashtag}
    ${API_UpdateOption}

    {{add_variation}}
    {{update_variation}}
    {{delete_variation}}
  }
`;

const API_EditVariation = `
  update_variation_{{variation_id}}: update_product_variation(where: {id: {_eq: {{variation_id}}}}, _set: {{data}}) {
    affected_rows
  }
`;

const API_DeleteVariation = `
  delete_variation_{{variation_id}}: delete_product_variation(where: {id: {_eq: {{variation_id}}}}) {
    affected_rows
  }
`;

const API_AddVariation = `
  add_variation_{{uni}}: insert_product_variation_one(object: {{data}}) {
    id
  }
`;

const API_GetOrderProduct = gql`
  query GetOrderProduct($variationID: [Int!]!, $status: [Int!]!) {
    order_product(where: { variation_id: { _in: $variationID }, order: { status: { _nin: $status } } }) {
      id
    }
  }
`;

type Data = {
  name: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    const { body, query } = req;

    const product_id = query.id;
    const variation: ProductVariation[] = body.variation;
    const { product: dataProduct, category, room, style, hashtag, option } = body;

    const productDetail = await graphqlClient.request<{ product: [ProductDetail] }>(API_GetProductDetail, {
      id: product_id,
    });
    const product = productDetail.product[0];

    const variationsEdit = variation
      .filter((i) => i.id)
      .map((i) =>
        API_EditVariation.replaceAll('{{variation_id}}', i?.id.toString() ?? '').replace(
          '{{data}}',
          JSON.stringify(i).replace(/"(\w+)"\s*:/g, '$1:'),
        ),
      );

    const variationsAdd = variation
      .filter((i) => !i.id)
      .map((i) =>
        API_AddVariation.replaceAll('{{uni}}', i.combUnicode.replace('-', '_')).replace(
          '{{data}}',
          JSON.stringify(i).replace(/"(\w+)"\s*:/g, '$1:'),
        ),
      );

    const variationDelete = product.product_variations.filter((i) => !variation.some((v) => v.id === i.id));
    const apiDeleteVariation = variationDelete.map((i) =>
      API_DeleteVariation.replaceAll('{{variation_id}}', i?.id.toString() ?? ''),
    );

    const { order_product: purchaseProduct } = await graphqlClient.request<{ order_product: any[] }>(
      API_GetOrderProduct,
      { variationID: variationDelete.map((i) => i.id), status: [OrderStatus.SUCCESS, OrderStatus.CANCEL] },
    );

    if (!isArrayEmpty(purchaseProduct))
      return res.status(400).json({ error_message: 'Không thể xóa phân loại đã được bán' });

    const api = API_EditProduct.replace('{{update_variation}}', variationsEdit.join(''))
      .replace('{{add_variation}}', variationsAdd.join(''))
      .replace('{{delete_variation}}', apiDeleteVariation.join(''));

    const updateProduct = await graphqlClient.request(api, {
      productID: Number(product_id),
      product: dataProduct,
      category,
      room,
      style,
      hashtag,
      option,
    });

    res.status(200).json({ updateProduct });
  } catch (error) {
    res.status(400).json({ error });
  }
}
