#!/usr/bin/env -S deno run --allow-all

import { downloadAndCopyTemplate } from './dev/run/lib/template.ts';

async function testIgnoreFunctionality() {
  console.log('🧪 Testing ignore functionality...\n');

  // Clean up any existing test directory
  try {
    await Deno.remove('./test-ignore-output', { recursive: true });
  } catch {
    // Directory doesn't exist, that's fine
  }

  // Test with app-mcp-stream template which should ignore docker and scripts folders
  console.log('Testing with app-mcp-stream template...');
  console.log(
    'Expected to ignore: docker, scripts folders and Readme.md, meta.json files\n'
  );

  await downloadAndCopyTemplate(
    'app-mcp-stream', // templateType
    '', // templateName (empty for whole folder)
    './test-ignore-output', // targetPath
    false // isFile
  );

  console.log('\n🔍 Checking what was actually copied...');

  try {
    const entries = [];
    for await (const entry of Deno.readDir('./test-ignore-output')) {
      entries.push(`${entry.isDirectory ? '📁' : '📄'} ${entry.name}`);
    }

    console.log('Contents of test-ignore-output:');
    entries.forEach((entry) => console.log(`  ${entry}`));

    // Check if ignored items were actually ignored
    const hasDockerFolder = entries.some((e) => e.includes('docker'));
    const hasScriptsFolder = entries.some((e) => e.includes('scripts'));
    const hasReadmeFile = entries.some((e) => e.includes('Readme.md'));
    const hasMetaFile = entries.some((e) => e.includes('meta.json'));

    console.log('\n📊 Ignore test results:');
    console.log(`  Docker folder ignored: ${!hasDockerFolder ? '✅' : '❌'}`);
    console.log(`  Scripts folder ignored: ${!hasScriptsFolder ? '✅' : '❌'}`);
    console.log(`  Readme.md file ignored: ${!hasReadmeFile ? '✅' : '❌'}`);
    console.log(`  meta.json file ignored: ${!hasMetaFile ? '✅' : '❌'}`);
  } catch (error) {
    console.error('Error reading test output directory:', error);
  }
}

if (import.meta.main) {
  await testIgnoreFunctionality();
}
