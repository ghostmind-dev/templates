import type { CustomArgs, CustomOptions } from 'jsr:@ghostmind/run';
import { $ } from 'npm:zx@8.1.3';

export default async function (_arg: CustomArgs, opts: CustomOptions) {
  $.verbose = true;

  const PGHOST = Deno.env.get('PGHOST');
  const PGUSER = Deno.env.get('PGUSER');
  const PGPASSWORD = Deno.env.get('PGPASSWORD');
  const PGPORT = Deno.env.get('PGPORT') || '5432';
  const DB_NAME = Deno.env.get('DB_NAME') || 'my_new_db';

  const dbName = _arg[0] || DB_NAME;

  if (!PGHOST || !PGUSER || !PGPASSWORD) {
    throw new Error(
      'PGHOST, PGUSER, and PGPASSWORD must be set in the environment'
    );
  }

  // Check if the database exists
  const checkResult =
    await $`PGPASSWORD=${PGPASSWORD} psql -h ${PGHOST} -U ${PGUSER} -p ${PGPORT} -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='${dbName}'" --set=sslmode=require`;

  if (checkResult.stdout.trim() !== '1') {
    console.log(`Database '${dbName}' does not exist. Nothing to terminate.`);
    return;
  }

  console.log(`⚠️  WARNING: You are about to DELETE the database '${dbName}'`);
  console.log(
    `This action is IRREVERSIBLE and will permanently destroy all data!`
  );
  console.log(`Database: ${dbName}`);
  console.log(`Host: ${PGHOST}`);

  // First confirmation
  const firstConfirm = prompt(
    '\n🔴 FIRST CONFIRMATION: Are you absolutely sure you want to DELETE this database? Type "yes" to continue: '
  );
  if (firstConfirm !== 'yes') {
    console.log('❌ Database deletion cancelled.');
    return;
  }

  // Second confirmation
  console.log('\n⚠️  FINAL WARNING: This is your last chance to cancel!');
  const secondConfirm = prompt(
    `🔴 SECOND CONFIRMATION: Type the database name "${dbName}" exactly to confirm deletion: `
  );
  if (secondConfirm !== dbName) {
    console.log('❌ Database deletion cancelled. Database name did not match.');
    return;
  }

  try {
    // Terminate active connections to the database
    console.log(`🔄 Terminating active connections to database '${dbName}'...`);
    await $`PGPASSWORD=${PGPASSWORD} psql -h ${PGHOST} -U ${PGUSER} -p ${PGPORT} -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '${dbName}' AND pid <> pg_backend_pid();" --set=sslmode=require`;

    // Drop the database
    console.log(`🗑️  Deleting database '${dbName}'...`);
    await $`PGPASSWORD=${PGPASSWORD} psql -h ${PGHOST} -U ${PGUSER} -p ${PGPORT} -d postgres -c 'DROP DATABASE "${dbName}";' --set=sslmode=require`;

    console.log(`✅ Database '${dbName}' has been successfully deleted.`);
  } catch (error) {
    console.error(`❌ Error deleting database '${dbName}':`, error);
    throw error;
  }
}
