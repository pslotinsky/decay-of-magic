import { InspectedClassMember } from './InspectedClassMember';
import { InspectedClassRelation } from './InspectedClassRelation';

export { InspectedClassMember } from './InspectedClassMember';
export { InspectedClassRelation } from './InspectedClassRelation';

type InspectedClassParams = {
  name: string;
  file: string;
  layer: string;
  body: string;
  abstract: boolean;
  description?: string;
  parent?: string;
  interfaces?: string[];
  fields?: string[];
  members?: InspectedClassMember[];
  relations?: InspectedClassRelation[];
};

/**
 * Represents a single class discovered during inspection
 */
export class InspectedClass {
  public static withRelations(
    cls: InspectedClass,
    relations: InspectedClassRelation[],
  ): InspectedClass {
    return new InspectedClass({ ...cls, relations });
  }

  readonly name: string;
  readonly file: string;
  readonly layer: string;
  readonly body: string;
  readonly abstract: boolean;
  readonly description?: string;
  readonly parent?: string;
  readonly interfaces?: string[];
  readonly fields?: string[];
  readonly members?: InspectedClassMember[];
  readonly relations?: InspectedClassRelation[];

  constructor(params: InspectedClassParams) {
    this.name = params.name;
    this.file = params.file;
    this.layer = params.layer;
    this.body = params.body;
    this.abstract = params.abstract;
    this.description = params.description;
    this.parent = params.parent;
    this.interfaces = params.interfaces;
    this.fields = params.fields;
    this.members = params.members;
    this.relations = params.relations;
  }

  public get link(): string {
    return `[${this.name}](${this.file})`;
  }

  public isEqual(other: InspectedClass): boolean {
    return this.name === other.name;
  }

  public toString(): string {
    const members = this.members ?? [];

    const content =
      members.length > 0
        ? members.map((member) => `  ${member.toString()}`).join('\n')
        : '';

    return content
      ? `class ${this.name} {\n${content}\n}`
      : `class ${this.name}`;
  }
}
