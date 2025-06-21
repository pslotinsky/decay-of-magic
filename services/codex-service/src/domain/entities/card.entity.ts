export type CardParams = {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  level: number;
  cost: number;
  manaId: string;
};

export class Card {
  public static create(params: CardParams): Card {
    return new Card(params);
  }

  public readonly id: string;
  public name: string;
  public imageUrl: string;
  public description: string;
  public level: number;
  public cost: number;
  public manaId: string;

  protected constructor(params: CardParams) {
    this.id = params.id;
    this.name = params.name;
    this.imageUrl = params.imageUrl;
    this.description = params.description;
    this.level = params.level;
    this.cost = params.cost;
    this.manaId = params.manaId;
  }
}
