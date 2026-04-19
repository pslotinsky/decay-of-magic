import { basename, resolve } from 'path';

import { ClassRegistryParser } from './ClassRegistryParser/ClassRegistryParser';
import { ConfigLoader } from './Config/ConfigLoader';
import { PackageReport } from './ReadmeWriter/PackageReport';
import { ReadmeWriter } from './ReadmeWriter/ReadmeWriter';
import { Scanner } from './Scanner/Scanner';

/**
 * Inspector Poe himself. Coordinates the inspection process
 */
export class InspectorPoe {
  private readonly basePath: string;
  private readonly configLoader: ConfigLoader;

  constructor(basePath: string) {
    this.basePath = basePath;
    this.configLoader = new ConfigLoader();
  }

  public async inspect(path: string): Promise<void> {
    const packagePath = resolve(this.basePath, path);

    console.info();
    console.info(`inspecting ${basename(packagePath)}...`);
    console.time('inspection completed');

    const config = await this.configLoader.load(packagePath);
    const files = await new Scanner(packagePath, config.layers).scan();
    const classes = new ClassRegistryParser().parse(files);

    console.info(`classes found: ${classes.items.length}`);

    const content = new PackageReport(config, classes).render();

    await new ReadmeWriter(packagePath).write(content, 'classes');

    console.info('classes generated');

    console.timeEnd('inspection completed');
  }
}
