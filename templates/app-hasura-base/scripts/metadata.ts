import type { CustomArgs, CustomOptions } from "jsr:@ghostmind/run";
import { $, cd } from "npm:zx@8.1.2";

export default async function (arg: CustomArgs, opts: CustomOptions) {
  const { currentPath } = opts;

  cd(`${currentPath}/app/state`);

  const action = arg[0];

  const HASURA_GRAPHQL_ENDPOINT = Deno.env.get("HASURA_GRAPHQL_ENDPOINT");

  switch (action) {
    case "apply":
      await $`hasura metadata apply --endpoint ${HASURA_GRAPHQL_ENDPOINT}`;
      break;
    case "export":
      await $`hasura metadata export --endpoint ${HASURA_GRAPHQL_ENDPOINT}`;
      break;
  }
}
