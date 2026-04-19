import { basename, resolve } from 'path';

import { ClassRegistryParser } from './ClassRegistryParser/ClassRegistryParser';
import { ConfigLoader } from './Config/ConfigLoader';
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

    await new ReadmeWriter(packagePath).write(content, 'classes');

    console.info('classes generated');

    console.timeEnd('inspection completed');
  }
}
