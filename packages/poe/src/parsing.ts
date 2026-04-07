import { readFile } from 'fs/promises';
import { resolve } from 'path';

export type ClassEntry = {
  name: string;
  description?: string;
  parent?: string;
};

export type ClassDescriptor = ClassEntry & { file: string };

export async function parseFiles(
  files: string[],
  path: string,
): Promise<ClassDescriptor[]> {
  const descriptors: ClassDescriptor[] = [];

  for (const file of files) {
    const filePath = resolve(path, file);
    const content = await readFile(filePath, 'utf-8');
    for (const entry of extractClasses(content)) {
      descriptors.push({ ...entry, file });
    }
  }

  return descriptors;
}

function extractClasses(content: string): ClassEntry[] {
  const pattern =
    /(?:\/\*\*([\s\S]*?)\*\/\s*)?(?:export\s+)?(?:default\s+)?(?:abstract\s+)?class\s+(\w+)(?:\s+extends\s+(\w+))?/g;

  const results: ClassEntry[] = [];
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(content)) !== null) {
    const [, jsdoc, name, parent] = match;
    const description = jsdoc ? parseJsDoc(jsdoc) || undefined : undefined;
    results.push({
      name,
      ...(parent ? { parent } : {}),
      ...(description ? { description } : {}),
    });
  }

  return results;
}

function parseJsDoc(raw: string): string {
  return raw
    .split('\n')
    .map((line) => line.replace(/^\s*\*\s?/, '').trim())
    .filter((line) => line.length > 0 && !line.startsWith('@'))
    .join(' ')
    .trim();
}
