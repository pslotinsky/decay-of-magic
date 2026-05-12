import { readFile, writeFile } from 'fs/promises';
import { basename, join, resolve } from 'path';

export type WritePosition = 'top' | 'bottom';

/**
 * Updates README files with generated class tables. In check mode,
 * writes accumulate in memory without touching disk so callers can
 * compare against the original to detect drift
 */
export class ReadmeWriter {
  private readonly basePath: string;
  private readonly readmePath: string;
  private readonly checkMode: boolean;
  private originalContent: string | null | undefined;
  private currentContent: string | undefined;

  constructor(basePath: string, options: { check?: boolean } = {}) {
    this.basePath = basePath;
    this.readmePath = resolve(basePath, 'README.md');
    this.checkMode = options.check ?? false;
  }

  public get path(): string {
    return this.readmePath;
  }

  public async read(): Promise<string> {
    return this.load();
  }

  public async write(
    content: string,
    type: string,
    position: WritePosition = 'bottom',
  ): Promise<void> {
    const readme = await this.load();
    const updated = this.updateContent(readme, content, type, position);

    this.currentContent = updated;

    if (!this.checkMode) {
      await writeFile(this.readmePath, updated, 'utf-8');
    }
  }

  public async isStale(): Promise<boolean> {
    if (this.currentContent === undefined) return false;

    const original = await this.readOriginal();

    return original !== this.currentContent;
  }

  public async originalSnapshot(): Promise<string> {
    return (await this.readOriginal()) ?? '';
  }

  public currentSnapshot(): string {
    return this.currentContent ?? '';
  }

  private async load(): Promise<string> {
    if (this.currentContent !== undefined) {
      return this.currentContent;
    }

    const original = await this.readOriginal();

    if (original !== null) {
      return original;
    }

    const name = await this.readPackageName();

    return `# ${this.titleCase(name)}\n\n`;
  }

  private async readOriginal(): Promise<string | null> {
    if (this.originalContent !== undefined) {
      return this.originalContent;
    }

    try {
      this.originalContent = await readFile(this.readmePath, 'utf-8');
    } catch {
      this.originalContent = null;
    }

    return this.originalContent;
  }

  private titleCase(text: string): string {
    return text
      .split('-')
      .filter((part) => part.length > 0)
      .map((part) => part[0].toUpperCase() + part.slice(1))
      .join(' ');
  }

  private updateContent(
    readme: string,
    content: string,
    type: string,
    position: WritePosition,
  ): string {
    const startTag = `<!-- poe:${type}:start -->`;
    const endTag = `<!-- poe:${type}:end -->`;
    const section = `${startTag}\n${content}\n${endTag}`;
    const start = readme.indexOf(startTag);
    const end = readme.indexOf(endTag);

    if (start !== -1 && end !== -1) {
      return (
        readme.slice(0, start) + section + readme.slice(end + endTag.length)
      );
    }

    if (position === 'top') {
      return this.insertAfterTitle(readme, section);
    }

    return readme.trimEnd() + `\n\n${section}\n`;
  }

  private insertAfterTitle(readme: string, section: string): string {
    const titleMatch = /^# .+\n/m.exec(readme);

    if (!titleMatch) {
      return `${section}\n\n${readme}`;
    }

    const insertAt = titleMatch.index + titleMatch[0].length;
    const trailing = readme.slice(insertAt).replace(/^\n+/, '');

    return readme.slice(0, insertAt) + `\n${section}\n\n${trailing}`;
  }

  private async readPackageName(): Promise<string> {
    try {
      const raw = await readFile(join(this.basePath, 'package.json'), 'utf-8');
      const pkg = JSON.parse(raw) as { name?: string };
      return pkg.name ?? basename(this.basePath);
    } catch {
      return basename(this.basePath);
    }
  }
}
