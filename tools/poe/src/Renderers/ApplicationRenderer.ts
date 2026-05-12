import type { ClassRegistry } from '../ClassRegistry/ClassRegistry';
import type { InspectedClass } from '../ClassRegistry/InspectedClass';
import type { LayerConfig } from '../Config/PoeConfig';
import type { Renderer } from './Renderer';
import { TypeLinker } from './TypeLinker';

const HANDLER_INTERFACES = new Set(['ICommandHandler', 'IQueryHandler']);

const OTHER_GROUP = 'Other';

/**
 * Renders a layer as a use-case table. Entry points (facades without a
 * parent base) get a separate section. Handlers and abstract bases are
 * hidden as implementation detail.
 */
export class ApplicationRenderer implements Renderer {
  public render(
    _layer: LayerConfig,
    classes: InspectedClass[],
    registry: ClassRegistry,
  ): string {
    const visible = classes.filter((cls) => this.isVisible(cls));
    const useCases = visible.filter((cls) => cls.parent !== undefined);
    const entryPoints = visible.filter((cls) => cls.parent === undefined);

    if (useCases.length === 0 && entryPoints.length === 0) {
      return '';
    }

    const linker = new TypeLinker(registry);
    const sections: string[] = [];

    if (entryPoints.length > 0) {
      sections.push(this.renderEntryPointsSection(entryPoints));
    }

    for (const [entity, group] of this.groupByEntity(useCases)) {
      sections.push(this.renderEntitySection(entity, group, linker));
    }

    return sections.join('\n\n');
  }

  private groupByEntity(
    useCases: InspectedClass[],
  ): Array<[string, InspectedClass[]]> {
    const groups = new Map<string, InspectedClass[]>();

    for (const cls of useCases) {
      const entity = this.entityName(cls);
      const bucket = groups.get(entity) ?? [];
      bucket.push(cls);
      groups.set(entity, bucket);
    }

    return [...groups.entries()].sort(([a], [b]) => {
      if (a === OTHER_GROUP) return 1;
      if (b === OTHER_GROUP) return -1;
      return a.localeCompare(b);
    });
  }

  private entityName(cls: InspectedClass): string {
    const ret = this.returnType(cls);

    if (!ret) {
      return OTHER_GROUP;
    }

    return ret
      .trim()
      .split('|')[0]
      .trim()
      .replace(/\[\]$/, '')
      .replace(/Dto$/, '');
  }

  private renderEntitySection(
    entity: string,
    useCases: InspectedClass[],
    linker: TypeLinker,
  ): string {
    const rows = [
      '| Use case | Description |',
      '|----------|-------------|',
      ...useCases.map((cls) => this.useCaseRow(cls, linker)),
    ];

    return `### ${entity}\n\n${rows.join('\n')}`;
  }

  private renderEntryPointsSection(entryPoints: InspectedClass[]): string {
    const list = entryPoints
      .map((cls) =>
        cls.description
          ? `- ${cls.link} — ${cls.description}`
          : `- ${cls.link}`,
      )
      .join('\n');

    return `### Entry points\n\n${list}`;
  }

  private isVisible(cls: InspectedClass): boolean {
    if (cls.abstract) {
      return false;
    }

    return !cls.interfaces?.some((name) => HANDLER_INTERFACES.has(name));
  }

  private useCaseRow(cls: InspectedClass, linker: TypeLinker): string {
    const description = this.descriptionCell(cls, linker);

    return `| ${cls.link} | ${description} |`;
  }

  private descriptionCell(cls: InspectedClass, linker: TypeLinker): string {
    const signature = linker
      .renderSignature(this.params(cls), this.returnType(cls) || undefined)
      .join('<br>');
    const paragraphs: string[] = [];

    if (signature) {
      paragraphs.push(signature);
    }

    if (cls.description) {
      paragraphs.push(cls.description);
    }

    return paragraphs.join('<br><br>');
  }

  private params(cls: InspectedClass): string[] {
    const fields = (cls.members ?? []).filter((member) => !member.isMethod);

    return fields.map((member) =>
      member.type ? `${member.name}: ${member.type}` : member.name,
    );
  }

  private returnType(cls: InspectedClass): string {
    if (!cls.parentGenerics) {
      return '';
    }

    const parts = this.splitTopLevel(cls.parentGenerics);
    const last = parts.at(-1) ?? '';

    // Single generic arg ending with "Params" is the input type (the return
    // slot was left to the base class default), not the return type
    if (parts.length === 1 && /Params$/.test(last)) {
      return '';
    }

    return last;
  }

  private splitTopLevel(text: string): string[] {
    const parts: string[] = [];
    let depth = 0;
    let current = '';

    for (const ch of text) {
      if (ch === '<') depth++;
      else if (ch === '>') depth--;

      if (ch === ',' && depth === 0) {
        parts.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }

    if (current.trim()) {
      parts.push(current.trim());
    }

    return parts;
  }
}
