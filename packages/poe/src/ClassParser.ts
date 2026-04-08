import { readFile } from 'fs/promises';
import { resolve } from 'path';

import { InspectedClass } from './InspectedClass';
import { ClassRegistry } from './ClassRegistry';

const CLASS_PATTERN =
  /^\s*(?:\/\*\*([\s\S]*?)\*\/\s*)?(?:export\s+)?(?:default\s+)?(abstract\s+)?class\s+(\w+)(?:\s+extends\s+(\w+))?(?:\s+implements\s+([\w,\s]+))?/gm;

/**
 * Parses source files and extracts inspected classes
 */
export class ClassParser {
  constructor(private readonly packagePath: string) {}

  public async parse(files: string[]): Promise<ClassRegistry> {
    const result: InspectedClass[] = [];

    for (const file of files) {
      const content = await this.readContent(file);
      const classes = this.extractClasses(content, file);
      result.push(...classes);
    }

    return new ClassRegistry(result);
  }

  private async readContent(file: string): Promise<string> {
    return readFile(resolve(this.packagePath, file), 'utf-8');
  }

  private extractClasses(content: string, file: string): InspectedClass[] {
    const pattern = new RegExp(CLASS_PATTERN.source, 'gm');
    const layer = this.getLayer(file);
    const results: InspectedClass[] = [];
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(content)) !== null) {
      const [, jsdoc, abstractKeyword, name, parent, implementsStr] = match;

      results.push(
        new InspectedClass({
          name,
          file,
          layer,
          abstract: !!abstractKeyword,
          description: jsdoc ? this.parseJsDoc(jsdoc) : undefined,
          parent: parent ?? undefined,
          interfaces: implementsStr
            ? this.parseInterfaces(implementsStr)
            : undefined,
        }),
      );
    }

    return results;
  }

  private getLayer(file: string): string {
    const parts = file.replace(/\\/g, '/').split('/');
    const segment = parts[1];

    return segment && !segment.endsWith('.ts') ? segment : 'root';
  }

  private parseJsDoc(raw: string): string | undefined {
    const comment = raw
      .split('\n')
      .map((line) => line.replace(/^\s*\*\s?/, '').trim())
      .filter((line) => line.length > 0 && !line.startsWith('@'))
      .join('<br>');

    return comment.length > 0 ? comment : undefined;
  }

  private parseInterfaces(raw: string): string[] {
    return raw
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean);
  }
}
