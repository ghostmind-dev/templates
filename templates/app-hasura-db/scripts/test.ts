import type { CustomArgs, CustomOptions } from 'jsr:@ghostmind/run';
import { gql, GraphQLClient } from 'npm:graphql-request@7.1.0';

export default async function (_arg: CustomArgs, opts: CustomOptions) {
  const endpoint_login = Deno.env.get('HASURA_GRAPHQL_ENDPOINT') as string;

  const endpoint_secret = Deno.env.get('HASURA_GRAPHQL_ADMIN_SECRET') as string;

  const graphQLClient = new GraphQLClient(`${endpoint_login}/v1/graphql`, {
    headers: {
      'X-Hasura-Admin-Secret': endpoint_secret,
    },
  });

  const sendRequest = gql`
    query MyQuery {
      __typename ## Placeholder value
    }
  `;

  const response = await graphQLClient.request(sendRequest);

  console.log(response);
}
