import { ClassRegistry } from './ClassRegistry';
import { LayerReport } from './LayerReport';

/**
 * Aggregated report describing inspected classes
 */
export class ClassReport {
  private readonly classRegistry: ClassRegistry;

  constructor(classRegistry: ClassRegistry) {
    this.classRegistry = classRegistry;
  }

  public render(): string {
    if (this.classRegistry.isEmpty) {
      return 'No classes found.';
    }

    const content = Object.entries(this.classRegistry.layers)
      .filter(([, classes]) => classes.length > 0)
      .map(([layer, classes]) =>
        new LayerReport(layer, classes, this.classRegistry).render(),
      )
      .join('\n\n');

    return `## Classes\n\n${content}`;
  }
}
