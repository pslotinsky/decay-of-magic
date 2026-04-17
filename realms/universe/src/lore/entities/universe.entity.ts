import { Entity } from '@dod/core';

export type UniverseParams = {
  id: string;
  name: string;
  description?: string;
  cover?: string;
};

export class Universe extends Entity {
  public static create(params: UniverseParams): Universe {
    return new Universe(params);
  }

  public readonly id: string;
  public name: string;
  public description?: string;
  public cover?: string;

  protected constructor(params: UniverseParams) {
    super();
    this.id = params.id;
    this.name = params.name;
    this.description = params.description;
    this.cover = params.cover;
  }
}
