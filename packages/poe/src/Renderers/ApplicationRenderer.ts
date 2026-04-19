import { InspectedClass } from '../ClassRegistry/InspectedClass';
import { LayerConfig } from '../Config/PoeConfig';
import { Renderer } from './Renderer';

const HANDLER_INTERFACES = new Set(['ICommandHandler', 'IQueryHandler']);

const OTHER_GROUP = 'Other';

/**
 * Renders a layer as a use-case table. Entry points (facades without a
 * parent base) get a separate section. Handlers and abstract bases are
 * hidden as implementation detail.
 */
export class ApplicationRenderer implements Renderer {
  public render(_layer: LayerConfig, classes: InspectedClass[]): string {
    const visible = classes.filter((cls) => this.isVisible(cls));
    const useCases = visible.filter((cls) => cls.parent !== undefined);
    const entryPoints = visible.filter((cls) => cls.parent === undefined);

    if (useCases.length === 0 && entryPoints.length === 0) {
      return '';
    }

    const sections: string[] = [];

    if (entryPoints.length > 0) {
      sections.push(this.renderEntryPointsSection(entryPoints));
    }

    for (const [entity, group] of this.groupByEntity(useCases)) {
      sections.push(this.renderEntitySection(entity, group));
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
  ): string {
    const rows = [
      '| Use case | Description |',
      '|----------|-------------|',
      ...useCases.map((cls) => this.useCaseRow(cls)),
    ];

    return `#### ${entity}\n\n${rows.join('\n')}`;
  }

  private renderEntryPointsSection(entryPoints: InspectedClass[]): string {
    const list = entryPoints
      .map((cls) =>
        cls.description
          ? `- ${cls.link} — ${cls.description}`
          : `- ${cls.link}`,
      )
      .join('\n');

    return `#### Entry points\n\n${list}`;
  }

  private isVisible(cls: InspectedClass): boolean {
    if (cls.abstract) {
      return false;
    }

    return !cls.interfaces?.some((name) => HANDLER_INTERFACES.has(name));
  }

  private useCaseRow(cls: InspectedClass): string {
    const description = this.descriptionCell(cls);

    return `| ${cls.link} | ${description} |`;
  }

  private descriptionCell(cls: InspectedClass): string {
    const signatureLines = this.signatureLines(cls);
    const signature = signatureLines.join('<br>');
    const paragraphs: string[] = [];

    if (signature) {
      paragraphs.push(signature);
    }

    if (cls.description) {
      paragraphs.push(cls.description);
    }

    return paragraphs.join('<br><br>');
  }

  private signatureLines(cls: InspectedClass): string[] {
    const lines: string[] = [];

    const params = this.params(cls);

    if (params) {
      lines.push(`Params: \`${this.escape(params)}\``);
    }

    const returnType = this.returnType(cls);

    if (returnType) {
      lines.push(`Returns: \`${this.escape(returnType)}\``);
    }

    return lines;
  }

  private escape(text: string): string {
    return text.replace(/\|/g, '\\|');
  }

  private params(cls: InspectedClass): string {
    const fields = (cls.members ?? []).filter((member) => !member.isMethod);

    if (fields.length === 0) {
      return '';
    }

    const args = fields
      .map((member) =>
        member.type ? `${member.name}: ${member.type}` : member.name,
      )
      .join(', ');

    return `(${args})`;
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
