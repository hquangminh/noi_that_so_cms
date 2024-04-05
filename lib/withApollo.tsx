import { NextPageContext } from 'next';

import { ApolloClient, createHttpLink, InMemoryCache, ApolloProvider, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

import { getCookieByName } from './utils';

const HOST = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ENGINE_HOSTNAME;

type SSRComponentElements = { getInitialProps?: (ctx: NextPageContext) => Promise<any> };

const withApollo = (App: React.FC<any> & SSRComponentElements) => {
  const httpLink = createHttpLink({ uri: `https://${HOST}/v1/graphql`, credentials: 'same-origin' });

  const authLink = setContext((_, { headers }) => {
    const token = getCookieByName('token');
    return { headers: { ...headers, authorization: token ? `Bearer ${token}` : ' ' } };
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.forEach(({ message, locations, path }) =>
        console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`),
      );
    if (networkError) console.log(`[Network error]: ${networkError}`);
  });

  const client = new ApolloClient({
    link: ApolloLink.from([errorLink, authLink.concat(httpLink)]),
    cache: new InMemoryCache(),
  });

  function Apollo(props: any) {
    return (
      <ApolloProvider client={client}>
        <App {...props} apolloClient={client} />
      </ApolloProvider>
    );
  }

  return Apollo;
};

export default withApollo;
