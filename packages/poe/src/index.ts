#!/usr/bin/env node

import { resolve } from 'path';

import { InspectorPoe } from './InspectorPoe';

async function main(): Promise<void> {
  const [command, ...paths] = process.argv.slice(2);

  if (command !== 'inspect' || paths.length === 0) {
    console.error('Usage: poe inspect <package-path> [...]');
    process.exit(1);
  }

  const basePath = resolve(__dirname, '../../..');
  const poe = new InspectorPoe(basePath);

  for (const path of paths) {
    await poe.inspect(path);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
