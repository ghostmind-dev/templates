import type { CustomArgs, CustomOptions } from 'jsr:@ghostmind/run';
import { $ } from 'npm:zx@8.1.3';

export default async function (_arg: CustomArgs, opts: CustomOptions) {
  $.verbose = true;

  const SERVER_URL = Deno.env.get('SERVER_URL');
  const SERVER_TOKEN = Deno.env.get('SERVER_TOKEN');

  await $`npx -p mcp-remote@latest mcp-remote-client ${SERVER_URL} --header "Authorization:${SERVER_TOKEN}"`;
}
