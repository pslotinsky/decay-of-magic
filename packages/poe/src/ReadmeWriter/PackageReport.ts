import { ClassRegistry } from '../ClassRegistry/ClassRegistry';
import { ClassDiagram } from './ClassDiagram';
import { ClassTable } from './ClassTable';

const LAYER_SPLIT_THRESHOLD = 25;

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
    return this.classRegistry.items.length < LAYER_SPLIT_THRESHOLD
      ? this.renderFlat()
      : this.renderByLayers();
  }

  private renderFlat(): string {
    const diagram = this.diagram.renderAll();
    const ordered = Object.values(this.classRegistry.layers).flat();
    const table = new ClassTable(
      '',
      ordered,
      this.classRegistry,
      true,
    ).renderContent();

    return `## Classes\n\n${diagram}\n\n${table}`;
  }

  private renderByLayers(): string {
    const layers = Object.entries(this.classRegistry.layers)
      .map(([layer, classes]) => {
        const diagram = this.diagram.renderLayer(layer, classes);
        const table = new ClassTable(
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
