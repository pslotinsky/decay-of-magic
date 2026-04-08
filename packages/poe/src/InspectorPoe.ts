import { basename, resolve } from 'path';

import { ClassReport } from './ClassReport';
import { ClassDiagram } from './ClassDiagram';
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
    const classReportContent = new ClassReport(classes).render();
    await readmeWriter.write(classReportContent, 'class-table');

    console.info('class table generated');

    const classDiagramContent = new ClassDiagram(classes).render();

    if (classDiagramContent) {
      await readmeWriter.write(classDiagramContent, 'class-diagram');
      console.info('class diagram generated');
    }

    console.timeEnd('inspection completed');
  }
}
