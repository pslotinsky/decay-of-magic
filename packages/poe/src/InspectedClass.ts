type InspectedClassParams = {
  name: string;
  file: string;
  layer: string;
  abstract: boolean;
  description?: string;
  parent?: string;
  interfaces?: string[];
};

/**
 * Represents a single class discovered during inspection
 */
export class InspectedClass {
  readonly name: string;
  readonly file: string;
  readonly layer: string;
  readonly abstract: boolean;
  readonly description?: string;
  readonly parent?: string;
  readonly interfaces?: string[];

  constructor(params: InspectedClassParams) {
    this.name = params.name;
    this.file = params.file;
    this.layer = params.layer;
    this.abstract = params.abstract;
    this.description = params.description;
    this.parent = params.parent;
    this.interfaces = params.interfaces;
  }

  public get link(): string {
    return `[${this.name}](${this.file})`;
  }
}
