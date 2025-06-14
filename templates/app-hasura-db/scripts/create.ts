import type { CustomArgs, CustomOptions } from 'jsr:@ghostmind/run';
import { $ } from 'npm:zx@8.1.3';

export default async function (_arg: CustomArgs, opts: CustomOptions) {
  $.verbose = true;

  const PGHOST = Deno.env.get('PGHOST');
  const PGUSER = Deno.env.get('PGUSER');
  const PGPASSWORD = Deno.env.get('PGPASSWORD');
  const PGPORT = Deno.env.get('PGPORT') || '5432';

  const dbName = _arg[0] || 'my_new_db';

  if (!PGHOST || !PGUSER || !PGPASSWORD) {
    throw new Error(
      'PGHOST, PGUSER, and PGPASSWORD must be set in the environment'
    );
  }

  // Check if the database exists
  const checkResult =
    await $`PGPASSWORD=${PGPASSWORD} psql -h ${PGHOST} -U ${PGUSER} -p ${PGPORT} -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='${dbName}'" --set=sslmode=require`;

  if (checkResult.stdout.trim() === '1') {
    console.log(`Database '${dbName}' already exists.`);
    return;
  }

  // Create the database if it does not exist
  await $`PGPASSWORD=${PGPASSWORD} psql -h ${PGHOST} -U ${PGUSER} -p ${PGPORT} -d postgres -c 'CREATE DATABASE "${dbName}";' --set=sslmode=require`;
  console.log(`Database '${dbName}' created.`);
}
