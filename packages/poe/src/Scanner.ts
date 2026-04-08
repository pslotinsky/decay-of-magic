import { type Dirent } from 'fs';
import { readdir } from 'fs/promises';
import { join } from 'path';

/**
 * Searches the project for classes worthy of inspection
 */
export class Scanner {
  private readonly basePath: string;

  constructor(basePath: string) {
    this.basePath = basePath;
  }

  public async scan(): Promise<string[]> {
    return this.scanDir().catch(() => []);
  }

  private async scanDir(dir: string = 'src'): Promise<string[]> {
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

  private async scanItem(item: Dirent<string>, dir: string): Promise<string[]> {
    const path = join(dir, item.name);

    if (item.isDirectory()) {
      return this.scanDir(path);
    }

    if (item.isFile() && this.isTsFile(item.name)) {
      return [path];
    }

    return [];
  }

  private isTsFile(name: string): boolean {
    return (
      name.endsWith('.ts') &&
      !name.endsWith('.spec.ts') &&
      !name.endsWith('.d.ts')
    );
  }
}
