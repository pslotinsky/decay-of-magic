export class ScannedFile {
  constructor(
    public readonly path: string,
    public readonly content: string,
  ) {}

  public contains(text: string): boolean {
    return this.content.includes(text);
  }
}
