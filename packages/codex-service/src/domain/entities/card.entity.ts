export type CardProps = {
  id: string;
  name: string;
  description: string;
  schoolId: string;
  cost: number;
};

export class Card {
  public static create(props: CardProps): Card {
    return new Card(props);
  }

  protected constructor(private readonly props: CardProps) {}

  public get id(): string {
    return this.props.id;
  }

  public get name(): string {
    return this.props.name;
  }

  public get description(): string {
    return this.props.description;
  }

  public get schoolId(): string {
    return this.props.schoolId;
  }

  public get cost(): number {
    return this.props.cost;
  }
}
