import { dockerComposeBuild, dockerComposeUp } from 'jsr:@ghostmind/run';
import type { CustomArgs, CustomOptions } from 'jsr:@ghostmind/run';
import { $ } from 'npm:zx';

export default async function (args: CustomArgs, opts: CustomOptions) {
  const { run, has } = opts;

  if (has('build')) {
    await dockerComposeBuild({});
  }

  const processes = [];

  if (has('tunnel')) {
    const TUNNEL_NAME = Deno.env.get('TUNNEL_NAME');
    Deno.env.set('NEXTAUTH_URL', `https://${TUNNEL_NAME}`);

    processes.push($`${run} tunnel run`);
  }

  if (has('up')) {
    processes.push(
      dockerComposeUp({
        forceRecreate: true,
      })
    );
  }

  await Promise.all(processes);
}
