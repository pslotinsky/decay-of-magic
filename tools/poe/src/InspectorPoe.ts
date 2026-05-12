import { readFile } from 'fs/promises';
import { basename, join, resolve } from 'path';

import { ClassRegistryParser } from './ClassRegistryParser/ClassRegistryParser';
import { ConfigLoader } from './Config/ConfigLoader';
import { HeaderBuilder } from './ReadmeWriter/HeaderBuilder';
import { PackageReport } from './ReadmeWriter/PackageReport';
import { ReadmeWriter } from './ReadmeWriter/ReadmeWriter';
import { Scanner } from './Scanner/Scanner';
import { SchemaReader } from './Schema/SchemaReader';

/**
 * Inspector Poe himself. Coordinates the inspection process
 */
export class InspectorPoe {
  private readonly basePath: string;
  private readonly configLoader: ConfigLoader;
  private readonly schemaReader: SchemaReader;

  constructor(basePath: string) {
    this.basePath = basePath;
    this.configLoader = new ConfigLoader();
    this.schemaReader = new SchemaReader();
  }

  public async inspect(path: string): Promise<void> {
    const packagePath = resolve(this.basePath, path);

    console.info();
    console.info(`inspecting ${basename(packagePath)}...`);
    console.time('inspection completed');

    const config = await this.configLoader.load(packagePath);
    const [files, schema] = await Promise.all([
      new Scanner(packagePath, config.layers).scan(),
      this.schemaReader.read(packagePath),
    ]);
    const classes = new ClassRegistryParser().parse(files, schema);

    console.info(`classes found: ${classes.items.length}`);

    const content = new PackageReport(config, classes).render();
    const writer = new ReadmeWriter(packagePath);

    await writer.write(content, 'classes');
    await writer.write(InspectorPoe.FOOTER, 'footer');

    const description = await this.readPackageDescription(packagePath);
    const builder = new HeaderBuilder();
    const readme = await writer.read();

    if (builder.hasContent(description, readme)) {
      const header = builder.build(description, readme);
      await writer.write(header, 'header', 'top');
    }

    console.info('classes generated');

    console.timeEnd('inspection completed');
  }

  private async readPackageDescription(
    packagePath: string,
  ): Promise<string | undefined> {
    try {
      const raw = await readFile(join(packagePath, 'package.json'), 'utf-8');
      const pkg = JSON.parse(raw) as { description?: string };
      return pkg.description?.trim() || undefined;
    } catch {
      return undefined;
    }
  }

  private static readonly FOOTER =
    '> This document was inspected and assembled by Inspector Poe.';
}
