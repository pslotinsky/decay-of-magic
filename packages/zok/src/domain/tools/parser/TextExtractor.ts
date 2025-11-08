export type Extraction = {
  extractedText: string;
  remainingText: string;
};

type Token = {
  value: string;
  index: number;
  count: number;
};

export class TextExtractor {
  public static extractBetween(
    text: string,
    startToken: string,
    endToken: string = startToken,
  ): Extraction {
    const extractor = new TextExtractor(text, startToken, endToken);

    return extractor.execute();
  }

  private readonly text: string;
  private readonly isSameTokens: boolean;
  private readonly startToken: Token;
  private readonly endToken: Token;
  private remainingText: string;

  protected constructor(text: string, startToken: string, endToken: string) {
    this.text = text;
    this.remainingText = text;
    this.isSameTokens = startToken === endToken;
    this.startToken = this.initToken(startToken);
    this.endToken = this.initToken(endToken);
  }

  public execute(): Extraction {
    for (
      let index = 0;
      index < this.text.length && !this.isFinalTokenFound;
      index++
    ) {
      if (this.isTokenMatched(this.startToken)) {
        this.updateStartToken(index);
      }

      if (this.isTokenMatched(this.endToken)) {
        this.updateEndToken(index);
      }

      this.updateRemainingText(index);
    }

    return {
      remainingText: this.remainingText,
      extractedText: this.extractedText,
    };
  }

  private get isFinalTokenFound(): boolean {
    const { startToken, endToken } = this;

    return this.isSameTokens
      ? startToken.count > 1
      : startToken.count > 0 && endToken.count === startToken.count;
  }

  private isTokenMatched(token: Token): boolean {
    return this.remainingText.startsWith(token.value);
  }

  private updateStartToken(index: number): void {
    this.startToken.count++;

    if (this.startToken.count === 1) {
      this.startToken.index = index;
    }
  }

  private updateEndToken(index: number): void {
    this.endToken.count++;
    this.endToken.index = index;
  }

  private get extractedText(): string {
    let content = '';

    if (this.isFinalTokenFound) {
      const { startToken, endToken } = this;

      content = this.text.substring(
        startToken.index + startToken.value.length,
        endToken.index,
      );
    }

    return content;
  }

  private updateRemainingText(index: number): void {
    this.remainingText = this.text.substring(index + 1);
  }

  private initToken(value: string): Token {
    return {
      value,
      index: 0,
      count: 0,
    };
  }
}
