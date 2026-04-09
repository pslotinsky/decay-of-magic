export class InspectedClassRelation {
  constructor(
    public readonly from: string,
    public readonly to: string,
    public readonly arrow: string,
  ) {}

  public toString(): string {
    return `${this.from} ${this.arrow} ${this.to}`;
  }
}
