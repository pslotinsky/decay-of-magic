import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

type ChildEntry = {
  dir: string;
  name: string;
  description: string;
};

/**
 * Scans a folder for child workspaces (subdirs with a package.json) and
 * builds a markdown table that lists each child with its description
 */
export class ChildrenTable {
  public async build(folderPath: string): Promise<string> {
    const children = await this.collectChildren(folderPath);

    if (children.length === 0) {
      return '';
    }

    const header = this.columnHeader(folderPath);
    const rows = [
      `| ${header} | Description |`,
      '| ----- | ----------- |',
      ...children.map(
        (child) => `| [${child.name}](${child.dir}/) | ${child.description} |`,
      ),
    ];

    return rows.join('\n');
  }

  private async collectChildren(folderPath: string): Promise<ChildEntry[]> {
    const entries = await readdir(folderPath, { withFileTypes: true });
    const children: ChildEntry[] = [];

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const pkgPath = join(folderPath, entry.name, 'package.json');
      const pkg = await this.readPackage(pkgPath);

      if (!pkg) continue;

      children.push({
        dir: entry.name,
        name: this.titleCase(entry.name),
        description: pkg.description?.trim() ?? '',
      });
    }

    children.sort((a, b) => a.dir.localeCompare(b.dir));

    return children;
  }

  private async readPackage(
    pkgPath: string,
  ): Promise<{ description?: string } | undefined> {
    try {
      const raw = await readFile(pkgPath, 'utf-8');
      return JSON.parse(raw) as { description?: string };
    } catch {
      return undefined;
    }
  }

  private columnHeader(folderPath: string): string {
    const folderName = folderPath.split(/[/\\]/).pop() ?? '';
    const capitalized = this.titleCase(folderName);

    return capitalized.endsWith('s') ? capitalized.slice(0, -1) : capitalized;
  }

  private titleCase(text: string): string {
    return text
      .split('-')
      .filter((part) => part.length > 0)
      .map((part) => part[0].toUpperCase() + part.slice(1))
      .join(' ');
  }
}
