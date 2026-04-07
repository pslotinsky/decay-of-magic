import { Dirent } from 'fs';
import { readdir } from 'fs/promises';
import { join } from 'path';

export async function scanFiles(path: string): Promise<string[]> {
  return scan(path).catch(() => []);
}

async function scan(basePath: string, dir: string = 'src'): Promise<string[]> {
  const dirPath = join(basePath, dir);
  const items = await readdir(dirPath, { withFileTypes: true });

  const nested = await Promise.all(
    items.map(async (item) => {
      const path = join(dir, item.name);

      let files: string[] = [];

      if (item.isDirectory()) {
        files = await scan(basePath, path);
      } else if (isTsFile(item)) {
        files = [path];
      }

      return files;
    }),
  );

  return nested.flat();
}

function isTsFile(item: Dirent<string>): boolean {
  return (
    item.isFile() &&
    item.name.endsWith('.ts') &&
    !item.name.endsWith('.spec.ts') &&
    !item.name.endsWith('.d.ts')
  );
}
