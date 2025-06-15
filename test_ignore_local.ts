#!/usr/bin/env -S deno run --allow-all

// Test script that uses local meta.json files
async function testLocalIgnore() {
  console.log('🧪 Testing ignore functionality with local meta.json...\n');

  // Read local meta.json
  const metaContent = await Deno.readTextFile(
    './templates/app-mcp-stream/meta.json'
  );
  const meta = JSON.parse(metaContent);

  console.log('📋 Local meta.json template config:');
  if (meta.template) {
    console.log(
      `   - ignoreFiles: [${meta.template.ignoreFiles?.join(', ') || ''}]`
    );
    console.log(
      `   - ignoreFolders: [${meta.template.ignoreFolders?.join(', ') || ''}]`
    );
  } else {
    console.log('   - No template config found');
  }

  // Simulate the ignore logic
  const ignoreFiles = meta.template?.ignoreFiles || [];
  const ignoreFolders = meta.template?.ignoreFolders || [];

  // List actual files in the template directory
  console.log('\n📁 Files and folders in app-mcp-stream template:');
  const entries = [];
  for await (const entry of Deno.readDir('./templates/app-mcp-stream')) {
    entries.push({
      name: entry.name,
      isDirectory: entry.isDirectory,
      shouldIgnore: entry.isDirectory
        ? ignoreFolders.includes(entry.name)
        : ignoreFiles.includes(entry.name),
    });
  }

  entries.forEach((entry) => {
    const type = entry.isDirectory ? '📁' : '📄';
    const status = entry.shouldIgnore ? '⏭️  (IGNORE)' : '✅ (COPY)';
    console.log(`  ${type} ${entry.name} ${status}`);
  });

  console.log('\n🔍 Ignore logic test:');
  const ignoredFiles = entries.filter((e) => !e.isDirectory && e.shouldIgnore);
  const ignoredFolders = entries.filter((e) => e.isDirectory && e.shouldIgnore);
  const copiedFiles = entries.filter((e) => !e.isDirectory && !e.shouldIgnore);
  const copiedFolders = entries.filter((e) => e.isDirectory && !e.shouldIgnore);

  console.log(
    `  Files to ignore: ${ignoredFiles.map((f) => f.name).join(', ') || 'none'}`
  );
  console.log(
    `  Folders to ignore: ${
      ignoredFolders.map((f) => f.name).join(', ') || 'none'
    }`
  );
  console.log(
    `  Files to copy: ${copiedFiles.map((f) => f.name).join(', ') || 'none'}`
  );
  console.log(
    `  Folders to copy: ${
      copiedFolders.map((f) => f.name).join(', ') || 'none'
    }`
  );
}

if (import.meta.main) {
  await testLocalIgnore();
}
