#!/usr/bin/env -S deno run --allow-all

import { downloadAndCopyTemplate } from './dev/run/lib/template.ts';

async function testInitFunctionality() {
  console.log('🧪 Testing init functionality...\n');

  // Clean up any existing test directory
  try {
    await Deno.remove('./test-init-output', { recursive: true });
  } catch {
    // Directory doesn't exist, that's fine
  }

  // Test with app-hasura-db template which has init commands
  console.log('Testing with app-hasura-db template...');
  console.log('Expected to run init commands: ["echo 40"]\n');

  await downloadAndCopyTemplate(
    'app-hasura-db', // templateType
    '', // templateName (empty for whole folder)
    './test-init-output', // targetPath
    false // isFile
  );

  console.log('\n🔍 Checking what was actually copied...');

  try {
    const entries = [];
    for await (const entry of Deno.readDir('./test-init-output')) {
      entries.push(`${entry.isDirectory ? '📁' : '📄'} ${entry.name}`);
    }

    console.log('Contents of test-init-output:');
    entries.forEach((entry) => console.log(`  ${entry}`));

    console.log('\n✅ Init functionality test completed!');
  } catch (error) {
    console.error('Error reading test output directory:', error);
  }
}

if (import.meta.main) {
  await testInitFunctionality();
}
