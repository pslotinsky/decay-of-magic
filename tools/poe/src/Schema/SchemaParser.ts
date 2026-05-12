import {
  PrismaField,
  PrismaModel,
  PrismaRelation,
  PrismaSchema,
} from './PrismaSchema';

const SCALAR_TYPES = new Set([
  'String',
  'Int',
  'BigInt',
  'Boolean',
  'DateTime',
  'Float',
  'Decimal',
  'Bytes',
  'Json',
]);

const MODEL_START = /^model\s+(\w+)\s*\{/;
const MAP_LINE = /@@map\s*\(\s*"([^"]+)"\s*\)/;
const FIELD_MAP_ATTR = /@map\s*\(\s*"([^"]+)"\s*\)/;
const RELATION_WITH_FIELDS = /@relation\s*\([^)]*\bfields\s*:/;
const RELATION_FIELDS_LIST = /@relation\s*\([^)]*\bfields\s*:\s*\[([^\]]*)\]/;

/**
 * Parses a Prisma schema file into a PrismaSchema
 */
export class SchemaParser {
  public parse(content: string): PrismaSchema {
    const models: PrismaModel[] = [];
    const lines = content.split('\n');

    let current: {
      name: string;
      tableName?: string;
      fields: PrismaField[];
      relations: PrismaRelation[];
    } | null = null;

    for (const rawLine of lines) {
      const line = rawLine.trim();

      if (!current) {
        const match = MODEL_START.exec(line);
        if (match) {
          current = {
            name: match[1],
            fields: [],
            relations: [],
          };
        }
        continue;
      }

      if (line === '}') {
        models.push(
          new PrismaModel(
            current.name,
            current.tableName,
            current.fields,
            current.relations,
          ),
        );
        current = null;
        continue;
      }

      if (line === '' || line.startsWith('//')) continue;

      const mapMatch = MAP_LINE.exec(line);
      if (mapMatch && line.startsWith('@@')) {
        current.tableName = mapMatch[1];
        continue;
      }

      if (line.startsWith('@@')) continue;

      this.parseFieldLine(line, current);
    }

    return new PrismaSchema(models);
  }

  private parseFieldLine(
    line: string,
    current: {
      name: string;
      fields: PrismaField[];
      relations: PrismaRelation[];
    },
  ): void {
    const tokens = line.split(/\s+/);

    if (tokens.length < 2) return;

    const [name, rawType, ...attrs] = tokens;
    const attrText = attrs.join(' ');

    const list = rawType.endsWith('[]');
    const optional = rawType.endsWith('?');
    const type = rawType.replace(/[?[\]]/g, '');

    if (!/^[A-Za-z_]\w*$/.test(name) || !/^[A-Za-z_]\w*$/.test(type)) {
      return;
    }

    if (SCALAR_TYPES.has(type)) {
      const mappedMatch = FIELD_MAP_ATTR.exec(attrText);
      current.fields.push({
        name,
        type,
        optional,
        list,
        isId: /@id\b/.test(attrText),
        isUnique: /@unique\b/.test(attrText),
        mapped: mappedMatch?.[1],
      });
      return;
    }

    if (RELATION_WITH_FIELDS.test(attrText)) {
      const fieldsMatch = RELATION_FIELDS_LIST.exec(attrText);
      const fkFields = fieldsMatch
        ? fieldsMatch[1]
            .split(',')
            .map((part) => part.trim())
            .filter(Boolean)
        : [];

      current.relations.push({
        holder: current.name,
        target: type,
        field: name,
        optional,
        list,
        fkFields,
      });
    }
  }
}
