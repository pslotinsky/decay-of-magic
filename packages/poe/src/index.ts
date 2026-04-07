#!/usr/bin/env node

import { resolve } from 'path';
import { generateDocumentation } from './generation';

async function main(): Promise<void> {
  const [command, ...paths] = process.argv.slice(2);

  if (command !== 'inspect' || paths.length === 0) {
    console.error('Usage: poe inspect <package-path> [...]');
    process.exit(1);
  }

  for (const path of paths) {
    const absolutePath = resolve(__dirname, '../../..', path);
    await generateDocumentation(absolutePath);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
