#!/usr/bin/env node

import { InspectorPoe } from './InspectorPoe';

async function main(): Promise<void> {
  const [command, ...paths] = process.argv.slice(2);

  if (command !== 'inspect') {
    console.error('Usage: poe inspect [package-path ...]');
    process.exit(1);
  }

  const poe = new InspectorPoe(process.cwd());
  const targets = paths.length > 0 ? paths : ['.'];

  for (const path of targets) {
    await poe.inspect(path);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
