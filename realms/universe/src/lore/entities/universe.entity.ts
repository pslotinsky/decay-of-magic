import { isEmpty } from 'lodash';

import { Entity } from '@dod/core';

export type UniverseSettings = Record<string, unknown>;

export type UniverseParams = {
  id: string;
  name: string;
  description?: string;
  cover?: string;
  settings: UniverseSettings;
};

export class Universe extends Entity {
  public static create(params: UniverseParams): Universe {
    return new Universe(params);
  }

  public readonly id: string;
  public name: string;
  public description?: string;
  public cover?: string;
  public settings: UniverseSettings;

  protected constructor(params: UniverseParams) {
    super();
    this.id = params.id;
    this.name = params.name;
    this.description = params.description;
    this.cover = params.cover;
    this.settings = params.settings;
  }

  public override update<T>(fields: Partial<T>): Set<keyof T> {
    const { settings, ...rest } = fields as Partial<UniverseParams>;

    return super.update({
      ...rest,
      settings: this.patchSettings(settings),
    } as unknown as Partial<T>);
  }

  private patchSettings(patch?: UniverseSettings): UniverseSettings {
    return isEmpty(patch) ? this.settings : { ...this.settings, ...patch };
  }
}
