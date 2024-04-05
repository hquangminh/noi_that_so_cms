import { GraphQLClient } from 'graphql-request';

const HOST = process.env.HASURA_GRAPHQL_ENGINE_HOSTNAME;
const PASS = process.env.HASURA_CONSOLE_PWD;

export const graphqlClient = new GraphQLClient(`https://${HOST}/v1/graphql`, {
  headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': PASS || '' },
  fetch: fetch,
});
