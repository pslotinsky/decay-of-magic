#!/usr/bin/env node

import { resolve } from 'path';
import { generateDocumentation } from './generation';

async function main(): Promise<void> {
  const paths = process.argv.slice(2);

  if (paths.length === 0) {
    console.error('Usage: gena <package-path> [...]');
    process.exit(1);
  }

  for (const path of paths) {
    console.time(`Documentation generated for "${path}"`);

    const absolutePath = resolve(__dirname, '../../..', path);
    await generateDocumentation(absolutePath);

    console.timeEnd(`Documentation generated for "${path}"`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
