import { NextRequest } from 'next/server';
import { graphqlClient } from 'server/configs/graphqlClient';
import { AccountType } from 'interface/Account';

const API_CheckAccount = `
  query ($token: String) {
    account(where: { token: { _eq: $token } }) {
      id
    }
  }
`;

export async function isAuthenticated(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (token)
    return await graphqlClient
      .request<{ account: [AccountType] }>(API_CheckAccount, { token })
      .then((res) => res.account[0] !== undefined)
      .catch(() => false);

  return false;
}
