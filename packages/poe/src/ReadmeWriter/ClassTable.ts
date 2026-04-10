import { InspectedClass } from '../ClassRegistry/InspectedClass';
import { ClassRegistry } from '../ClassRegistry/ClassRegistry';

/**
 * Renders a markdown table of inspected classes
 */
export class ClassTable {
  private readonly layer: string;
  private readonly classes: InspectedClass[];
  private readonly classRegistry: ClassRegistry;
  private readonly hasDescriptions: boolean;
  private readonly hasNotes: boolean;
  private readonly flat: boolean;

  constructor(
    layer: string,
    classes: InspectedClass[],
    classRegistry: ClassRegistry,
    flat: boolean = false,
  ) {
    this.layer = layer;
    this.classes = classes;
    this.classRegistry = classRegistry;
    this.hasDescriptions = classes.some((cls) => cls.description);
    this.hasNotes = classes.some((cls) => this.renderNotes(cls));
    this.flat = flat;
  }

  public render(): string {
    return `### ${this.layer}\n\n${this.renderContent()}`;
  }

  public renderContent(): string {
    const header = this.buildHeader();
    const rows = [
      header,
      header.replace(/[^|]/g, '-'),
      ...this.classes.map((cls) => this.buildRow(cls)),
    ];

    return rows.join('\n');
  }

  private buildHeader(): string {
    const cols = ['Entity'];

    if (this.hasDescriptions) {
      cols.push('Description');
    }

    if (this.hasNotes) {
      cols.push('Notes');
    }

    return this.renderRow(cols);
  }

  private buildRow(cls: InspectedClass): string {
    const cols = [this.entityCell(cls)];

    if (this.hasDescriptions) {
      cols.push(cls.description ?? '');
    }

    if (this.hasNotes) {
      cols.push(this.renderNotes(cls));
    }

    return this.renderRow(cols);
  }

  private renderRow(cols: string[]): string {
    return '| ' + cols.join(' | ') + ' |';
  }

  private entityCell(cls: InspectedClass): string {
    const parts = cls.file.replace(/\\/g, '/').split('/');
    const subdir = parts.slice(this.flat ? 1 : 2, -1).join('/');
    const prefix = subdir ? `${subdir}/` : '';

    return `${prefix}${cls.link}`;
  }

  private renderNotes(cls: InspectedClass): string {
    const parts: string[] = [];

    if (cls.abstract) {
      parts.push('Abstract');
    }

    if (cls.parent) {
      const parent = this.classRegistry.get(cls.parent);
      const parentRef = parent ? parent.link : `\`${cls.parent}\``;

      parts.push(`Extends ${parentRef}`);
    }

    if (cls.interfaces?.length) {
      const interfaces = cls.interfaces
        .map((name) => {
          const cls = this.classRegistry.get(name);
          return cls ? cls.link : `\`${name}\``;
        })
        .join(', ');

      parts.push(`Implements ${interfaces}`);
    }

    return parts.join(' · ');
  }
}
