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

  private renderDiagram(): string {
    this.clearLines();

    this.addLine('## Class Diagram');
    this.addLine();
    this.addLine('```mermaid');
    this.addLine('classDiagram');

    for (const [layer, classes] of Object.entries(this.classRegistry.layers)) {
      if (classes.length > 0) {
        this.addNamespace(layer, classes);
      }
    }

    this.addRelations();

    this.addLine('```');

    return this.lines.join('\n');
  }

  private addRelations(): void {
    for (const cls of this.classRegistry.items) {
      if (cls.parent && this.isKnownName(cls.parent)) {
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

  private addNamespace(layer: string, classes: InspectedClass[]): void {
    this.addLine(`  namespace ${layer} {`);

    for (const cls of classes) {
      this.addLine(`    class ${cls.name}`);
    }

    this.addLine('  }');
    this.addLine();
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
