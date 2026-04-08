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
};

/**
 * Represents a single class discovered during inspection
 */
export class InspectedClass {
  readonly name: string;
  readonly file: string;
  readonly layer: string;
  readonly body: string;
  readonly abstract: boolean;
  readonly description?: string;
  readonly parent?: string;
  readonly interfaces?: string[];
  readonly fields?: string[];

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
  }

  public get link(): string {
    return `[${this.name}](${this.file})`;
  }

  public isEqual(other: InspectedClass): boolean {
    return this.name === other.name;
  }
}
