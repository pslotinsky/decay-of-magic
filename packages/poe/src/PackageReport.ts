import { ClassDiagram } from './ClassDiagram';
import { ClassRegistry } from './ClassRegistry';
import { LayerReport } from './LayerReport';

/**
 * Combined report grouping class tables and diagrams by layer
 */
export class PackageReport {
  private readonly classRegistry: ClassRegistry;
  private readonly diagram: ClassDiagram;

  constructor(classRegistry: ClassRegistry) {
    this.classRegistry = classRegistry;
    this.diagram = new ClassDiagram(classRegistry);
  }

  public render(): string {
    const layers = Object.entries(this.classRegistry.layers)
      .map(([layer, classes]) => {
        const diagram = this.diagram.renderLayer(layer, classes);
        const table = new LayerReport(
          layer,
          classes,
          this.classRegistry,
        ).renderContent();

        return `### ${layer}\n\n${diagram}\n\n${table}`;
      })
      .join('\n\n');

    return `## Classes\n\n${layers}`;
  }
}
