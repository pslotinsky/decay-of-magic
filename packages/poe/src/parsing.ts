import { readFile } from 'fs/promises';
import { resolve } from 'path';

export type ClassEntry = {
  name: string;
  abstract: boolean;
  description?: string;
  parent?: string;
  interfaces?: string[];
};

export type ClassDescriptor = ClassEntry & {
  file: string;
  layer: string;
};

export async function parseFiles(
  files: string[],
  path: string,
): Promise<ClassDescriptor[]> {
  const descriptors: ClassDescriptor[] = [];

  for (const file of files) {
    const filePath = resolve(path, file);
    const content = await readFile(filePath, 'utf-8');
    for (const entry of extractClasses(content)) {
      descriptors.push({ ...entry, file, layer: getLayer(file) });
    }
  }

  return descriptors;
}

function extractClasses(content: string): ClassEntry[] {
  const pattern =
    /(?:\/\*\*([\s\S]*?)\*\/\s*)?(?:export\s+)?(?:default\s+)?(abstract\s+)?class\s+(\w+)(?:\s+extends\s+(\w+))?(?:\s+implements\s+([\w,\s]+))?/g;

  const results: ClassEntry[] = [];
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(content)) !== null) {
    const [, jsdoc, abstractKeyword, name, parent, implementsStr] = match;

    results.push({
      name,
      parent,
      abstract: !!abstractKeyword,
      description: jsdoc ? parseJsDoc(jsdoc) : undefined,
      interfaces: implementsStr ? parseInterfaces(implementsStr) : undefined,
    });
  }

  return results;
}

function getLayer(file: string): string {
  const parts = file.replace(/\\/g, '/').split('/');
  const segment = parts[1];

  return segment && !segment.endsWith('.ts') ? segment : 'root';
}

function parseJsDoc(raw: string): string | undefined {
  const comment = raw
    .split('\n')
    .map((line) => line.replace(/^\s*\*\s?/, '').trim())
    .filter((line) => line.length > 0 && !line.startsWith('@'))
    .join(' ')
    .trim();

  return comment || undefined;
}

function parseInterfaces(raw: string): string[] {
  return raw
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
}
