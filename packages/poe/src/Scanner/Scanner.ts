import { type Dirent } from 'fs';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

import { ScannedFile } from './ScannedFile';

/**
 * Searches the project for classes worthy of inspection
 */
export class Scanner {
  private readonly basePath: string;

  constructor(basePath: string) {
    this.basePath = basePath;
  }

  public async scan(): Promise<ScannedFile[]> {
    return this.scanDir().catch(() => []);
  }

  private async scanDir(dir: string = 'src'): Promise<ScannedFile[]> {
    const items = await this.readItems(dir);

    const nested = await Promise.all(
      items.map((item) => this.scanItem(item, dir)),
    );

    return nested.flat();
  }

  private async readItems(dir: string): Promise<Dirent<string>[]> {
    const dirPath = join(this.basePath, dir);

    return readdir(dirPath, { withFileTypes: true });
  }

  private async scanItem(
    item: Dirent<string>,
    dir: string,
  ): Promise<ScannedFile[]> {
    let files: ScannedFile[];

    const path = join(dir, item.name);

    if (item.isDirectory()) {
      files = await this.scanDir(path);
    } else {
      const file = await this.scanFile(path);

      files = file ? [file] : [];
    }

    return files;
  }

  private async scanFile(path: string): Promise<ScannedFile | undefined> {
    let file: ScannedFile | undefined;

    if (this.isTsFile(path)) {
      const absolutePath = join(this.basePath, path);
      const content = await readFile(absolutePath, 'utf-8');
      file = new ScannedFile(path, content);
    }

    return file?.contains('class') ? file : undefined;
  }

  private isTsFile(name: string): boolean {
    return (
      name.endsWith('.ts') &&
      !name.endsWith('.spec.ts') &&
      !name.endsWith('.d.ts')
    );
  }
}
