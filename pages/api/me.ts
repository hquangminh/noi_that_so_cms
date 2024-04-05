import type { NextApiRequest, NextApiResponse } from 'next';
import { graphqlClient } from 'server/configs/graphqlClient';

const apiUser = `
  query ($token: String) {
    account(where: { token: { _eq: $token } }) {
      id
      username
      first_name
      last_name
      token
    }
  }
`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const token = req.headers.authorization?.slice(7);
    const user = await graphqlClient.request<any>(apiUser, { token });
    res.status(200).json({ error: false, data: user.account[0] });
  } catch (error) {
    res.status(401).json({ error: true, data: error });
  }
}
