/**
 * Holds the raw content of a scanned source file
 */
export class ScannedFile {
  constructor(
    public readonly path: string,
    public readonly content: string,
    public readonly layer: string,
  ) {}

  public contains(text: string): boolean {
    return this.content.includes(text);
  }
}
