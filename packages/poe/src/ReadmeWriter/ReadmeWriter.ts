import { readFile, writeFile } from 'fs/promises';
import { basename, join, resolve } from 'path';

/**
 * Updates README files with generated class tables
 */
export class ReadmeWriter {
  private readonly basePath: string;
  private readonly readmePath: string;

  constructor(basePath: string) {
    this.basePath = basePath;
    this.readmePath = resolve(basePath, 'README.md');
  }

  public async write(content: string, type: string): Promise<void> {
    let readme = await this.load();

    readme = this.updateContent(readme, content, type);

    await this.save(readme);
  }

  private async save(readme: string): Promise<void> {
    await writeFile(this.readmePath, readme, 'utf-8');
  }

  private async load(): Promise<string> {
    try {
      return await readFile(this.readmePath, 'utf-8');
    } catch {
      const name = await this.readPackageName();
      return `# ${name}\n\n`;
    }
  }

  private updateContent(readme: string, content: string, type: string): string {
    const startTag = `<!-- poe:${type}:start -->`;
    const endTag = `<!-- poe:${type}:end -->`;
    const section = `${startTag}\n${content}\n${endTag}`;
    const start = readme.indexOf(startTag);
    const end = readme.indexOf(endTag);
    const isExists = start !== -1 && end !== -1;

    return isExists
      ? readme.slice(0, start) + section + readme.slice(end + endTag.length)
      : readme.trimEnd() + `\n\n${section}\n`;
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
