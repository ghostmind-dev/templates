import { dockerComposeBuild, dockerComposeUp } from 'jsr:@ghostmind/run';
import type { CustomArgs, CustomOptions } from 'jsr:@ghostmind/run';

export default async function (_arg: CustomArgs, opts: CustomOptions) {
  const { run, start } = opts;

  await start({
    build: {
      command: dockerComposeBuild,
      priority: 998,
    },
    tunnel: `${run} tunnel run`,
    up: {
      command: dockerComposeUp,
      options: {
        forceRecreate: false,
      },
    },
  });
}
