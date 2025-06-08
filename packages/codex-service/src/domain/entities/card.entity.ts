export type CardParams = {
  id: string;
  name: string;
  description: string;
  schoolId: string;
  cost: number;
};

export class Card {
  public static create(params: CardParams): Card {
    return new Card(params);
  }

  public readonly id: string;
  public name: string;
  public description: string;
  public schoolId: string;
  public cost: number;

  protected constructor(params: CardParams) {
    this.id = params.id;
    this.name = params.name;
    this.description = params.description;
    this.schoolId = params.schoolId;
    this.cost = params.cost;
  }
}
