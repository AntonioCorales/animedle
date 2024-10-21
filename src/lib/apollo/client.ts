import { HttpLink } from "@apollo/client";

import {
  registerApolloClient,
  ApolloClient,
  InMemoryCache,
} from "@apollo/experimental-nextjs-app-support";

export const { PreloadQuery, getClient, query } = registerApolloClient(() => {
  return new ApolloClient({
    link: new HttpLink({
      uri: "https://graphql.anilist.co",
      fetch,
    }),
    cache: new InMemoryCache(),
  });
});
