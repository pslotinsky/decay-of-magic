import { basename, resolve } from 'path';

import { PackageReport } from './PackageReport';
import { ClassParser } from './ClassParser';
import { ReadmeWriter } from './ReadmeWriter';
import { Scanner } from './Scanner';

/**
 * Inspector Poe himself. Coordinates the inspection process
 */
export class InspectorPoe {
  private readonly basePath: string;

  constructor(basePath: string) {
    this.basePath = basePath;
  }

  public async inspect(path: string): Promise<void> {
    const packagePath = resolve(this.basePath, path);

    console.info();
    console.info(`inspecting ${basename(packagePath)}...`);
    console.time('inspection completed');

    const files = await new Scanner(packagePath).scan();
    const classes = await new ClassParser(packagePath).parse(files);

    console.info(`classes found: ${classes.items.length}`);

    const readmeWriter = new ReadmeWriter(packagePath);

    const content = new PackageReport(classes).render();

    await readmeWriter.write(content, 'classes');

    console.info('classes generated');

    console.timeEnd('inspection completed');
  }
}
