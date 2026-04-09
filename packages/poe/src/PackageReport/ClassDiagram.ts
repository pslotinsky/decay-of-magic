import { snakeCase } from 'lodash';

import { ClassRegistry } from '../ClassRegistryParser/ClassRegistry';
import { InspectedClass } from '../InspectedClass/InspectedClass';

/**
 * Generates a Mermaid class diagram from inspected classes
 */
export class ClassDiagram {
  private static addTextPadding(text: string, padding: number = 2): string {
    const indent = ' '.repeat(padding);

    return text
      .split('\n')
      .map((line) => `${indent}${line}`)
      .join('\n');
  }

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
    const namespace = snakeCase(layer);
    const content = classes.map((cls) => cls.toString()).join('\n');
    const contentWithPadding = ClassDiagram.addTextPadding(content);
    const namespaceString = `namespace ${namespace} {\n${contentWithPadding}\n}`;

    this.addLine(ClassDiagram.addTextPadding(namespaceString));
  }

  private addExternalNamespace(pkg: string, names: string[]): void {
    const namespace = pkg.replace(/^@/, '').replace(/[/-]/g, '_');

    const content = names.map((name) => `class ${name}`).join('\n');
    const contentWithPadding = ClassDiagram.addTextPadding(content);
    const namespaceString = `namespace ${namespace} {\n${contentWithPadding}\n}`;

    this.addLine(ClassDiagram.addTextPadding(namespaceString));
  }

  private getRelatedNames(cls: InspectedClass): string[] {
    return (cls.relations ?? [])
      .map((rel) => rel.to)
      .filter((name) => this.isKnownName(name));
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
    const relations = classes.flatMap((cls) => cls.relations ?? []);

    if (relations.length > 0) {
      const content = relations.join('\n');

      this.addLine();
      this.addLine(ClassDiagram.addTextPadding(content));
    }
  }

  private isKnownName(name: string): boolean {
    return this.knownNames.has(name);
  }

  private clearLines(): void {
    this.lines = [];
  }

  private addLine(content = ''): void {
    this.lines.push(content);
  }
}
