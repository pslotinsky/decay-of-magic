const TOC_MIN_HEADINGS = 2;

/**
 * Assembles the README header block: package description plus a
 * table of contents that mirrors the document's top-level sections
 */
export class HeaderBuilder {
  public build(description: string | undefined, readme: string): string {
    const parts: string[] = [];

    if (description) {
      parts.push(description.trim());
    }

    const toc = this.buildToc(readme);

    if (toc) {
      parts.push(toc);
    }

    return parts.join('\n\n');
  }

  public hasContent(description: string | undefined, readme: string): boolean {
    return Boolean(description?.trim()) || this.buildToc(readme).length > 0;
  }

  private buildToc(readme: string): string {
    const headings = this.collectHeadings(readme);

    if (headings.length < TOC_MIN_HEADINGS) {
      return '';
    }

    const list = headings
      .map((heading) => `- [${heading}](#${this.slugify(heading)})`)
      .join('\n');

    return `**On this page**\n\n${list}`;
  }

  private collectHeadings(readme: string): string[] {
    const HEADER_BLOCK =
      /<!-- poe:header:start -->[\s\S]*?<!-- poe:header:end -->/g;
    const sanitized = readme.replace(HEADER_BLOCK, '');
    const headings: string[] = [];
    const pattern = /^## (.+)$/gm;
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(sanitized)) !== null) {
      headings.push(match[1].trim());
    }

    return headings;
  }

  private slugify(heading: string): string {
    return heading
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  }
}
