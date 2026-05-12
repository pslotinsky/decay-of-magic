#!/usr/bin/env node

import { InspectorPoe } from './InspectorPoe';

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0];
  const checkMode = args.includes('--check');
  const paths = args.slice(1).filter((arg) => !arg.startsWith('--'));

  if (command !== 'inspect' && command !== 'index') {
    console.error('Usage: poe <inspect|index> [--check] [path ...]');
    process.exit(1);
  }

  const poe = new InspectorPoe(process.cwd());
  const targets = paths.length > 0 ? paths : ['.'];

  for (const path of targets) {
    if (command === 'inspect') {
      await poe.inspect(path, { check: checkMode });
    } else {
      await poe.index(path, { check: checkMode });
    }
  }

  if (checkMode) {
    const stale = await poe.staleReadmes();

    if (stale.length > 0) {
      console.error('');
      console.error(`${stale.length} README file(s) out of date:`);
      for (const path of stale) {
        console.error(`  - ${path}`);
      }
      console.error('');
      console.error("Run 'pnpm run docs' to regenerate.");
      process.exit(1);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
