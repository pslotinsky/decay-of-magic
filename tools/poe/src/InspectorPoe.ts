import { readFile } from 'node:fs/promises';
import { basename, join, resolve } from 'node:path';

import { ClassRegistry } from './ClassRegistry/ClassRegistry';
import { ClassRegistryParser } from './ClassRegistryParser/ClassRegistryParser';
import { ConfigLoader } from './Config/ConfigLoader';
import { ChildrenTable } from './Index/ChildrenTable';
import { HeaderBuilder } from './ReadmeWriter/HeaderBuilder';
import { PackageReport } from './ReadmeWriter/PackageReport';
import { ReadmeWriter } from './ReadmeWriter/ReadmeWriter';
import { ExternalTypeScanner } from './Scanner/ExternalTypeScanner';
import { Scanner } from './Scanner/Scanner';
import { SchemaReader } from './Schema/SchemaReader';

export type InspectorOptions = {
  check?: boolean;
};

/**
 * Inspector Poe himself. Coordinates the inspection process
 */
export class InspectorPoe {
  private readonly basePath: string;
  private readonly configLoader: ConfigLoader;
  private readonly schemaReader: SchemaReader;
  private readonly writers: ReadmeWriter[] = [];

  constructor(basePath: string) {
    this.basePath = basePath;
    this.configLoader = new ConfigLoader();
    this.schemaReader = new SchemaReader();
  }

  public async inspect(
    path: string,
    options: InspectorOptions = {},
  ): Promise<void> {
    const packagePath = resolve(this.basePath, path);

    console.info();
    console.info(`inspecting ${basename(packagePath)}...`);
    console.time('inspection completed');

    const config = await this.configLoader.load(packagePath);
    const [files, schema] = await Promise.all([
      new Scanner(packagePath, config.layers).scan(),
      this.schemaReader.read(packagePath),
    ]);
    const parsed = new ClassRegistryParser().parse(files, schema);
    const externalTypes = await new ExternalTypeScanner().scan(
      packagePath,
      parsed.externalSources,
    );
    const classes = new ClassRegistry(
      parsed.items,
      parsed.externalSources,
      parsed.endpoints,
      parsed.schema,
      externalTypes,
    );

    console.info(`classes found: ${classes.items.length}`);

    const content = new PackageReport(config, classes).render();
    const writer = this.createWriter(packagePath, options);

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

  public async index(
    path: string,
    options: InspectorOptions = {},
  ): Promise<void> {
    const folderPath = resolve(this.basePath, path);

    console.info();
    console.info(`indexing ${basename(folderPath)}...`);
    console.time('index completed');

    const table = await new ChildrenTable().build(folderPath);

    if (table.length === 0) {
      console.info('no children found');
      console.timeEnd('index completed');
      return;
    }

    const writer = this.createWriter(folderPath, options);

    await writer.write(table, 'children');

    const description = await this.readPackageDescription(folderPath);
    const builder = new HeaderBuilder();
    const readme = await writer.read();

    if (builder.hasContent(description, readme)) {
      const header = builder.build(description, readme);
      await writer.write(header, 'header', 'top');
    }

    console.info('index generated');

    console.timeEnd('index completed');
  }

  public async staleReadmes(): Promise<string[]> {
    const stale: string[] = [];

    for (const writer of this.writers) {
      if (await writer.isStale()) {
        stale.push(writer.path);
      }
    }

    return stale;
  }

  private createWriter(
    targetPath: string,
    options: InspectorOptions,
  ): ReadmeWriter {
    const writer = new ReadmeWriter(targetPath, { check: options.check });

    this.writers.push(writer);

    return writer;
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
