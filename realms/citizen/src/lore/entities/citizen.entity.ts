import { Entity } from '@dod/core';

export type CitizenParams = {
  id: string;
  nickname: string;
};

export class Citizen extends Entity {
  public static create(params: CitizenParams): Citizen {
    return new Citizen(params);
  }

  public readonly id: string;
  public nickname: string;

  protected constructor(params: CitizenParams) {
    super();
    this.id = params.id;
    this.nickname = params.nickname;
  }
}
