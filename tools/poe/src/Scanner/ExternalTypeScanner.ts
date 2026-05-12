import { readdir, readFile, realpath } from 'node:fs/promises';
import { join, relative } from 'node:path';

export type ExternalTypeLocation = {
  file: string;
  line: number;
};

const TYPE_EXPORT_PATTERN =
  /^\s*export\s+(?:abstract\s+)?(?:type|interface|class|enum)\s+(\w+)/gm;

/**
 * Resolves a workspace's peer packages via node_modules symlinks
 * and scans their source files for exported type/class/interface/enum
 * declarations
 */
export class ExternalTypeScanner {
  public async scan(
    consumerPath: string,
    sourcesByName: Map<string, string>,
  ): Promise<Map<string, ExternalTypeLocation>> {
    const namesByPackage = this.groupByPackage(sourcesByName);
    const result = new Map<string, ExternalTypeLocation>();

    for (const [packageSpec, names] of namesByPackage) {
      const workspaceDir = await this.resolveWorkspace(
        consumerPath,
        packageSpec,
      );

      if (!workspaceDir) continue;

      const found = await this.scanWorkspace(workspaceDir, names);

      for (const [name, location] of found) {
        result.set(name, {
          file: relative(consumerPath, location.file),
          line: location.line,
        });
      }
    }

    return result;
  }

  private groupByPackage(
    sourcesByName: Map<string, string>,
  ): Map<string, Set<string>> {
    const grouped = new Map<string, Set<string>>();

    for (const [name, source] of sourcesByName) {
      const packageSpec = this.toPackageSpec(source);
      const bucket = grouped.get(packageSpec) ?? new Set<string>();
      bucket.add(name);
      grouped.set(packageSpec, bucket);
    }

    return grouped;
  }

  private toPackageSpec(source: string): string {
    if (source.startsWith('@')) {
      const [scope, name] = source.split('/');
      return `${scope}/${name}`;
    }

    return source.split('/')[0];
  }

  private async resolveWorkspace(
    consumerPath: string,
    packageSpec: string,
  ): Promise<string | undefined> {
    try {
      const symlink = join(consumerPath, 'node_modules', packageSpec);
      return await realpath(symlink);
    } catch {
      return undefined;
    }
  }

  private async scanWorkspace(
    workspaceDir: string,
    namesOfInterest: Set<string>,
  ): Promise<Map<string, ExternalTypeLocation>> {
    const sourceDir = join(workspaceDir, 'src');
    const files = await this.walk(sourceDir);
    const found = new Map<string, ExternalTypeLocation>();

    for (const file of files) {
      const content = await readFile(file, 'utf-8');
      const pattern = new RegExp(TYPE_EXPORT_PATTERN.source, 'gm');
      let match: RegExpExecArray | null;

      while ((match = pattern.exec(content)) !== null) {
        const name = match[1];

        if (!namesOfInterest.has(name) || found.has(name)) continue;

        found.set(name, { file, line: this.lineOf(content, match.index) });
      }
    }

    return found;
  }

  private async walk(dir: string): Promise<string[]> {
    const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
    const out: string[] = [];

    for (const entry of entries) {
      const full = join(dir, entry.name);

      if (entry.isDirectory()) {
        out.push(...(await this.walk(full)));
      } else if (entry.isFile() && /\.tsx?$/.test(entry.name)) {
        out.push(full);
      }
    }

    return out;
  }

  private lineOf(content: string, offset: number): number {
    let line = 1;

    for (let pos = 0; pos < offset; pos++) {
      if (content[pos] === '\n') {
        line++;
      }
    }

    return line;
  }
}
