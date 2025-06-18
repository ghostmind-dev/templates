import type { CustomArgs, CustomOptions } from "jsr:@ghostmind/run";
import { $, cd } from "npm:zx@8.1.3";

export default async function (arg: CustomArgs, opts: CustomOptions) {
  $.verbose = true;

  const { currentPath } = opts;

  const action = arg[0];

  cd(`${currentPath}/app/state`);

  const HASURA_GRAPHQL_ENDPOINT = Deno.env.get("HASURA_GRAPHQL_ENDPOINT");

  switch (action) {
    case "apply":
      await $`hasura migrate apply --endpoint ${HASURA_GRAPHQL_ENDPOINT} --database-name default`;
      break;
    case "status":
      await $`hasura migrate status --endpoint ${HASURA_GRAPHQL_ENDPOINT} --database-name default`;
      break;
    case "squash": {
      // Use Hasura CLI's built-in squash functionality
      const migrationsDir = `${currentPath}/app/state/migrations/default`;

      try {
        // Get all migration directories
        const entries = [];
        for await (const dirEntry of Deno.readDir(migrationsDir)) {
          if (dirEntry.isDirectory) {
            entries.push(dirEntry.name);
          }
        }

        if (entries.length === 0) {
          console.log("No migrations found to squash.");
          break;
        }

        // Sort migration directories by name (timestamp order)
        entries.sort();

        // Get the earliest migration timestamp (first entry)
        const earliestMigration = entries[0];
        const fromTimestamp = earliestMigration.split("_")[0];

        console.log(`Found ${entries.length} migrations to squash:`);
        entries.forEach((entry) => console.log(`  - ${entry}`));
        console.log(`\nSquashing from migration: ${fromTimestamp}`);

        // Use Hasura CLI to squash migrations
        await $`hasura migrate squash --from ${fromTimestamp} --name "squashed" --delete-source --endpoint ${HASURA_GRAPHQL_ENDPOINT} --database-name default`;

        console.log("✅ Successfully squashed all migrations into one file!");
        console.log(
          "Note: If these migrations were already applied to your database, you may need to run:"
        );
        console.log(
          "hasura migrate apply --skip-execution --database-name default"
        );
      } catch (error) {
        console.error(
          "❌ Error during squash operation:",
          error instanceof Error ? error.message : String(error)
        );
        console.log("\nTroubleshooting tips:");
        console.log(
          "1. Make sure you're in the correct directory with config.yaml"
        );
        console.log("2. Ensure HASURA_GRAPHQL_ENDPOINT is set correctly");
        console.log("3. Check that Hasura CLI can connect to your instance");
      }
      break;
    }
  }
}

// Helper to check if a file exists
async function exists(path: string) {
  try {
    await Deno.stat(path);
    return true;
  } catch {
    return false;
  }
}
