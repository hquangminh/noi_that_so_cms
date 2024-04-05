import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { graphqlClient } from 'server/configs/graphqlClient';

const { HASURA_GRAPHQL_JWT_SECRET_KEY, NEXT_PUBLIC_JWT_TOKEN_EXPIRES } = process.env;

const apiUserCheck = `
  query ($username: String!, $password: String!) {
    account(where: { username: { _eq: $username }, password: { _eq: $password } }) {
      id
    }
  }
`;
const apiUserLogin = `
  mutation ($id: Int!, $token: String!) {
    update_account(where: {id: {_eq: $id}}, _set: {token: $token}) {
      returning {
        id
        username
        first_name
        last_name
        token
      }
    }
  }
`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const userCheck = await graphqlClient.request<any>(apiUserCheck, req.body);
    const token = generateToken(userCheck.account[0].id);
    const userLogin = await graphqlClient.request<any>(apiUserLogin, { id: userCheck.account[0].id, token });
    return res.status(200).json({ error: false, data: userLogin.update_account.returning[0] });
  } catch (error) {
    return res.status(500).json({ error: true, data: error });
  }
}

const generateToken = (userId: string) => {
  return jwt.sign(
    {
      'https://hasura.io/jwt/claims': {
        'x-hasura-default-role': 'manager',
        'x-hasura-allowed-roles': ['manager'],
        'x-hasura-user-id': userId.toString(),
      },
    },
    HASURA_GRAPHQL_JWT_SECRET_KEY as string,
    {
      expiresIn: NEXT_PUBLIC_JWT_TOKEN_EXPIRES || '15d',
    },
  );
};
