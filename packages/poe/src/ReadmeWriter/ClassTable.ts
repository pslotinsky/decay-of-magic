import { ClassRegistry } from '../ClassRegistry/ClassRegistry';
import { InspectedClass } from '../ClassRegistry/InspectedClass';

/**
 * Renders a markdown table of inspected classes
 */
export class ClassTable {
  private readonly root: string;
  private readonly classes: InspectedClass[];
  private readonly classRegistry: ClassRegistry;
  private readonly hasDescriptionColumn: boolean;

  constructor(
    root: string,
    classes: InspectedClass[],
    classRegistry: ClassRegistry,
  ) {
    this.root = root.replace(/\\/g, '/').replace(/\/$/, '');
    this.classes = classes;
    this.classRegistry = classRegistry;
    this.hasDescriptionColumn = classes.some(
      (cls) => cls.description || this.renderNotes(cls),
    );
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

    if (this.hasDescriptionColumn) {
      cols.push('Description');
    }

    return this.renderRow(cols);
  }

  private buildRow(cls: InspectedClass): string {
    const cols = [this.entityCell(cls)];

    if (this.hasDescriptionColumn) {
      cols.push(this.descriptionCell(cls));
    }

    return this.renderRow(cols);
  }

  private renderRow(cols: string[]): string {
    return '| ' + cols.join(' | ') + ' |';
  }

  private entityCell(cls: InspectedClass): string {
    const file = cls.file.replace(/\\/g, '/');
    const rootPrefix = `${this.root}/`;
    const relative = file.startsWith(rootPrefix)
      ? file.slice(rootPrefix.length)
      : file;
    const parts = relative.split('/');
    const subdir = parts.slice(0, -1).join('/');
    const prefix = subdir ? `${subdir}/` : '';

    return `${prefix}${cls.link}`;
  }

  private descriptionCell(cls: InspectedClass): string {
    const paragraphs: string[] = [];

    if (cls.description) {
      paragraphs.push(cls.description);
    }

    const notes = this.renderNotes(cls);

    if (notes) {
      paragraphs.push(notes);
    }

    return paragraphs.join('<br><br>');
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
