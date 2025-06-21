export type ManaParams = {
  id: string;
  name: string;
  type: ManaType;
};

export enum ManaType {
  Common = 'Common',
  Special = 'Special',
}

export class Mana {
  public static create(params: ManaParams): Mana {
    return new Mana(params);
  }

  public readonly id: string;
  public name: string;
  public type: ManaType;

  protected constructor(params: ManaParams) {
    this.id = params.id;
    this.name = params.name;
    this.type = params.type;
  }
}
