import { type ClassDescriptor, parseFiles } from './parsing';
import { renderClassTable } from './rendering';
import { scanFiles } from './io';
import { updateReadme } from './readme';

export async function generateDocumentation(path: string): Promise<void> {
  const files = await scanFiles(path);

  const descriptors = await parseFiles(files, path);

  await updateClassTable(path, descriptors);
}

async function updateClassTable(
  path: string,
  descriptors: ClassDescriptor[],
): Promise<void> {
  const classTable = renderClassTable(descriptors);
  await updateReadme(path, 'class-table', classTable);
}
