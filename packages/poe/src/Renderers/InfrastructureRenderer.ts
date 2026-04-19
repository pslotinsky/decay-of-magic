import { ClassRegistry } from '../ClassRegistry/ClassRegistry';
import { InspectedClass } from '../ClassRegistry/InspectedClass';
import { LayerConfig } from '../Config/PoeConfig';
import {
  PrismaField,
  PrismaModel,
  PrismaRelation,
  PrismaSchema,
} from '../Schema/PrismaSchema';
import { Renderer } from './Renderer';

/**
 * Renders a layer as an ER diagram derived from the Prisma schema
 */
export class InfrastructureRenderer implements Renderer {
  public render(
    _layer: LayerConfig,
    _classes: InspectedClass[],
    registry: ClassRegistry,
  ): string {
    const schema = registry.schema;

    if (!schema || schema.isEmpty) {
      return '';
    }

    return this.renderDiagram(schema);
  }

  private renderDiagram(schema: PrismaSchema): string {
    const lines: string[] = ['```mermaid', 'erDiagram'];

    for (const model of schema.models) {
      lines.push(...this.renderModelBlock(model));
    }

    for (const model of schema.models) {
      for (const relation of model.relations) {
        lines.push(`  ${this.renderRelation(model, relation)}`);
      }
    }

    lines.push('```');
    return lines.join('\n');
  }

  private renderModelBlock(model: PrismaModel): string[] {
    if (model.fields.length === 0) {
      return [`  ${model.name} {`, '  }'];
    }

    const fieldLines = model.fields.map(
      (field) => `    ${this.renderField(field)}`,
    );

    return [`  ${model.name} {`, ...fieldLines, '  }'];
  }

  private renderField(field: PrismaField): string {
    const parts = [field.type.toLowerCase(), field.name];

    if (field.isId) parts.push('PK');
    else if (field.isUnique) parts.push('UK');

    return parts.join(' ');
  }

  private renderRelation(model: PrismaModel, relation: PrismaRelation): string {
    const holder = model.name;
    const target = relation.target;
    const connector = this.relationConnector(model, relation);

    return `${holder} ${connector} ${target} : ${relation.field}`;
  }

  private relationConnector(
    model: PrismaModel,
    relation: PrismaRelation,
  ): string {
    if (relation.list) return '||--o{';

    const pkFields = model.fields
      .filter((field) => field.isId)
      .map((field) => field.name);
    const fkIsPk =
      relation.fkFields.length > 0 &&
      relation.fkFields.every((name) => pkFields.includes(name));

    if (fkIsPk) return relation.optional ? '|o--||' : '||--||';
    if (relation.optional) return '|o--||';

    return '}o--||';
  }
}
