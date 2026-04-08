import { InspectedClass } from './InspectedClass';
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

    const layers = this.groupByLayer();
    return Object.entries(layers)
      .filter(([, classes]) => classes.length > 0)
      .map(([layer, classes]) =>
        new LayerReport(layer, classes, this.classRegistry).render(),
      )
      .join('\n\n');
  }

  private groupByLayer(): Record<string, InspectedClass[]> {
    const groups: Record<string, InspectedClass[]> = {};

    for (const cls of this.classRegistry.items) {
      (groups[cls.layer] ??= []).push(cls);
    }

    const { root = [], ...layers } = groups;

    return { ...layers, root };
  }
}
