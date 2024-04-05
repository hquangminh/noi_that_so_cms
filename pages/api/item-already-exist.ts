import type { NextApiRequest, NextApiResponse } from 'next';
import { graphqlClient } from 'server/configs/graphqlClient';

import { removeSpaceString } from 'functions';

const API_RoomCategory = `
  query ($id:Int = 0, $name: String!) {
    room_type(where: {id: {_neq: $id}, name: {_ilike: $name}}) {
      id
    }
  }
`;

const API_StyleCategory = `
  query ($id:Int = 0, $name: String!) {
    style_type(where: {id: {_neq: $id}, name: {_ilike: $name}}) {
      id
    }
  }
`;

const API_ProductCategory = `
  query ($id:Int = 0, $name: String!) {
    product_category(where: {id: {_neq: $id}, name: {_ilike: $name}}) {
      id
    }
  }
`;

const API_BlogCategory = `
  query ($id:Int = 0, $name: String!) {
    blog_category(where: {id: {_neq: $id}, name: {_ilike: $name}}) {
      id
    }
  }
`;

const API_SeoPage = `
  query ($name: String!) {
    seo_page(where: {page: {_eq: $name}}) {
      id
    }
  }
`;

export default async function CheckItemAlreadyExist(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id, name, table } = req.query;

    let GqlAPI;
    if (table === 'room-category') GqlAPI = API_RoomCategory;
    else if (table === 'style-category') GqlAPI = API_StyleCategory;
    else if (table === 'product-category') GqlAPI = API_ProductCategory;
    else if (table === 'blog-category') GqlAPI = API_BlogCategory;
    else if (table === 'seo-page') GqlAPI = API_SeoPage;

    if (GqlAPI && name && typeof name === 'string') {
      const data = await graphqlClient.request<any>(GqlAPI, { id, name: removeSpaceString(name) });
      if (data) return res.status(200).json({ exist: data[Object.keys(data)[0]].length > 0 });
    } else return res.status(400).json({ error: false, message: 'Params are incorrect' });
  } catch (error) {
    res.status(404).json({ error: true, data: error });
  }
}
