import { Document } from '../document';

export class Remark {
  public static create(text: string, document?: Document): Remark {
    return new Remark(text, document);
  }

  public readonly text: string;
  public readonly document?: Document;

  protected constructor(text: string, document?: Document) {
    this.text = text;
    this.document = document;
  }

  public toString(): string {
    return this.text;
  }
}
