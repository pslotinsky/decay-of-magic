import { Document } from './Document';

export class DocumentLink {
  public static from(document: Document): DocumentLink {
    return new DocumentLink(document.id, document.title, document.relativePath);
  }

  public static parse(value: string): DocumentLink | undefined {
    let result: DocumentLink | undefined = undefined;

    const match = value.match(/^\[([^\]]*)\]\(([^)]*)\)$/);

    if (match) {
      const text = match[1];
      const path = match[2];
      const filenameMatch = path.match(/\/([^/]+)\.md$/);
      const id = filenameMatch ? filenameMatch[1].split('_')[0] : path;

      result = new DocumentLink(id, text, path);
    }

    return result;
  }

  public readonly id: string;
  public readonly text: string;
  public readonly path: string;

  constructor(id: string, text: string, path: string) {
    this.id = id;
    this.text = text;
    this.path = path;
  }

  public toString(): string {
    return `[${this.text}](${this.path})`;
  }
}
