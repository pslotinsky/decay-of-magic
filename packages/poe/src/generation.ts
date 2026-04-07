import { basename } from 'path';

import { type ClassDescriptor, parseFiles } from './parsing';
import { renderClassTable } from './rendering';
import { scanFiles } from './io';
import { updateReadme } from './readme';

export async function generateDocumentation(path: string): Promise<void> {
  console.info();
  console.info(`inspecting ${basename(path)}...`);
  console.time('inspection completed');

  const files = await scanFiles(path);
  const descriptors = await parseFiles(files, path);

  console.info(`classes found: ${descriptors.length}`);

  await updateClassTable(path, descriptors);

  console.info(`class table generated`);
  console.timeEnd('inspection completed');
}

async function updateClassTable(
  path: string,
  descriptors: ClassDescriptor[],
): Promise<void> {
  const classTable = renderClassTable(descriptors);
  await updateReadme(path, 'class-table', classTable);
}
