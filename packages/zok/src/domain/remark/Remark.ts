export class Remark {
  public static create(text: string): Remark {
    return new Remark(text);
  }

  public readonly text: string;

  protected constructor(text: string) {
    this.text = text;
  }

  public toString(): string {
    return this.text;
  }
}
