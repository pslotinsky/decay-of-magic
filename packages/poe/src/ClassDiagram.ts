import { ClassRegistry } from './ClassRegistry';
import { InspectedClass } from './InspectedClass';

/**
 * Generates a Mermaid class diagram from inspected classes
 */
export class ClassDiagram {
  private readonly classRegistry: ClassRegistry;
  private readonly knownNames: Set<string>;
  private lines: string[] = [];

  constructor(classRegistry: ClassRegistry) {
    this.classRegistry = classRegistry;
    this.knownNames = new Set(classRegistry.items.map((cls) => cls.name));
  }

  public render(): string {
    return this.classRegistry.isEmpty ? '' : this.renderDiagram();
  }

  public renderLayer(layer: string, classes: InspectedClass[]): string {
    this.clearLines();
    this.addLayerDiagram(layer, classes);
    return this.lines.join('\n');
  }

  private renderDiagram(): string {
    this.clearLines();

    this.addLine('## Class Diagram');

    for (const [layer, classes] of Object.entries(this.classRegistry.layers)) {
      this.addLine();
      this.addLine(`### ${layer}`);
      this.addLine();
      this.addLayerDiagram(layer, classes);
    }

    return this.lines.join('\n');
  }

  private addLayerDiagram(layer: string, classes: InspectedClass[]): void {
    const foreign = this.collectForeignClasses(classes);
    const external = this.collectExternalParents(classes);

    this.addLine('```mermaid');
    this.addLine('classDiagram');
    this.addNamespace(layer, classes);

    for (const [foreignLayer, foreignClasses] of Object.entries(
      this.groupByLayer(foreign),
    )) {
      this.addNamespace(foreignLayer, foreignClasses);
    }

    for (const [pkg, names] of Object.entries(external)) {
      this.addExternalNamespace(pkg, names);
    }

    this.addRelations(classes);
    this.addLine('```');
  }

  private addExternalNamespace(pkg: string, names: string[]): void {
    const namespace = pkg.replace(/^@/, '').replace(/[/-]/g, '_');

    this.addLine(`  namespace ${namespace} {`);

    for (const name of names) {
      this.addLine(`    class ${name}`);
    }

    this.addLine('  }');
  }

  private collectExternalParents(
    classes: InspectedClass[],
  ): Record<string, string[]> {
    const external: Record<string, Set<string>> = {};

    for (const cls of classes) {
      if (!cls.parent || this.isKnownName(cls.parent)) continue;

      const source = this.classRegistry.getExternalSource(cls.parent);

      if (source) {
        (external[source] ??= new Set()).add(cls.parent);
      }
    }

    return Object.fromEntries(
      Object.entries(external).map(([pkg, names]) => [pkg, [...names]]),
    );
  }

  private addNamespace(layer: string, classes: InspectedClass[]): void {
    this.addLine(`  namespace ${layer} {`);

    for (const cls of classes) {
      this.addLine(`    class ${cls.name}`);
    }

    this.addLine('  }');
  }

  private collectForeignClasses(classes: InspectedClass[]): InspectedClass[] {
    const layerNames = new Set(classes.map((cls) => cls.name));
    const foreign = new Map<string, InspectedClass>();

    for (const cls of classes) {
      for (const name of this.getRelatedNames(cls)) {
        if (!layerNames.has(name)) {
          const foreignClass = this.classRegistry.get(name);

          if (foreignClass) {
            foreign.set(name, foreignClass);
          }
        }
      }
    }

    return [...foreign.values()];
  }

  private getRelatedNames(cls: InspectedClass): string[] {
    const names: string[] = [];

    if (cls.parent && this.isKnownName(cls.parent)) {
      names.push(cls.parent);
    }

    for (const iface of cls.interfaces ?? []) {
      if (this.isKnownName(iface)) names.push(iface);
    }

    for (const field of cls.fields ?? []) {
      if (this.isKnownName(field)) names.push(field);
    }

    for (const other of this.classRegistry.items) {
      if (!other.isEqual(cls) && this.hasUsageRelation(cls, other)) {
        names.push(other.name);
      }
    }

    return names;
  }

  private groupByLayer(
    classes: InspectedClass[],
  ): Record<string, InspectedClass[]> {
    const groups: Record<string, InspectedClass[]> = {};

    for (const cls of classes) {
      (groups[cls.layer] ??= []).push(cls);
    }

    return groups;
  }

  private addRelations(classes: InspectedClass[]): void {
    this.addLine();

    for (const cls of classes) {
      if (cls.parent) {
        this.addRelation(cls.name, cls.parent, '--|>');
      }

      for (const iface of cls.interfaces ?? []) {
        if (this.isKnownName(iface)) {
          this.addRelation(cls.name, iface, '..|>');
        }
      }

      for (const fieldType of cls.fields ?? []) {
        if (this.isKnownName(fieldType)) {
          this.addRelation(cls.name, fieldType, '*--');
        }
      }

      for (const other of this.classRegistry.items) {
        if (!other.isEqual(cls) && this.hasUsageRelation(cls, other)) {
          this.addRelation(cls.name, other.name, '-->');
        }
      }
    }
  }

  private isKnownName(name: string): boolean {
    return this.knownNames.has(name);
  }

  private hasUsageRelation(
    cls: InspectedClass,
    other: InspectedClass,
  ): boolean {
    return (
      !this.isKnownRelation(cls, other.name) && cls.body.includes(other.name)
    );
  }

  private isKnownRelation(cls: InspectedClass, name: string): boolean {
    return (
      name === cls.parent ||
      (cls.interfaces ?? []).includes(name) ||
      (cls.fields ?? []).includes(name)
    );
  }

  private clearLines(): void {
    this.lines = [];
  }

  private addRelation(from: string, to: string, arrow: string): void {
    this.addLine(`  ${from} ${arrow} ${to}`);
  }

  private addLine(content = ''): void {
    this.lines.push(content);
  }
}
