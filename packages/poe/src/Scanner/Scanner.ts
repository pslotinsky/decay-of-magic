import { type Dirent } from 'fs';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

import { LayerConfig } from '../Config/PoeConfig';
import { ScannedFile } from './ScannedFile';

/**
 * Searches the project for classes worthy of inspection
 */
export class Scanner {
  private readonly basePath: string;
  private readonly layers: LayerConfig[];

  constructor(basePath: string, layers: LayerConfig[]) {
    this.basePath = basePath;
    this.layers = layers;
  }

  public async scan(): Promise<ScannedFile[]> {
    const perLayer = await Promise.all(
      this.layers.map((layer) => this.scanLayer(layer)),
    );

    return perLayer.flat();
  }

  private async scanLayer(layer: LayerConfig): Promise<ScannedFile[]> {
    return this.scanDir(layer, layer.root).catch(() => []);
  }

  private async scanDir(
    layer: LayerConfig,
    dir: string,
  ): Promise<ScannedFile[]> {
    const items = await this.readItems(dir);

    const nested = await Promise.all(
      items.map((item) => this.scanItem(layer, item, dir)),
    );

    return nested.flat();
  }

  private async readItems(dir: string): Promise<Dirent<string>[]> {
    const dirPath = join(this.basePath, dir);

    return readdir(dirPath, { withFileTypes: true });
  }

  private async scanItem(
    layer: LayerConfig,
    item: Dirent<string>,
    dir: string,
  ): Promise<ScannedFile[]> {
    let files: ScannedFile[];

    const path = join(dir, item.name);

    if (item.isDirectory()) {
      files = await this.scanDir(layer, path);
    } else {
      const file = await this.scanFile(layer, path);

      files = file ? [file] : [];
    }

    return files;
  }

  private async scanFile(
    layer: LayerConfig,
    path: string,
  ): Promise<ScannedFile | undefined> {
    let file: ScannedFile | undefined;

    if (this.isTsFile(path)) {
      const absolutePath = join(this.basePath, path);
      const content = await readFile(absolutePath, 'utf-8');
      file = new ScannedFile(path, content, layer.title);
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
