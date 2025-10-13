export class Remark<TResult = unknown> {
  public readonly text: string;
  public readonly result?: TResult;

  public constructor(text: string, result?: TResult) {
    this.text = text;
    this.result = result;
  }

  public toString(): string {
    return this.text;
  }
}
