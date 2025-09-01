import type { CustomArgs, CustomOptions } from 'jsr:@ghostmind/run';

export default async function (_arg: CustomArgs, opts: CustomOptions) {
  const { main } = opts;

  const { terraformActivate } = main;

  await terraformActivate({
    component: 'core',
  });
}
