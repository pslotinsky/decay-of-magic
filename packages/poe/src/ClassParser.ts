import { readFile } from 'fs/promises';
import { resolve } from 'path';

import { InspectedClass } from './InspectedClass';
import { ClassRegistry } from './ClassRegistry';

const CLASS_PATTERN =
  /^\s*(?:\/\*\*([\s\S]*?)\*\/\s*)?(?:export\s+)?(?:default\s+)?(abstract\s+)?class\s+(\w+)(?:\s+extends\s+(\w+))?(?:\s+implements\s+([\w,\s]+))?/gm;

const PRIMITIVE_TYPES = new Set([
  'string',
  'number',
  'boolean',
  'void',
  'null',
  'undefined',
  'any',
  'never',
  'unknown',
  'object',
  'symbol',
  'bigint',
]);

/**
 * Parses source files and extracts inspected classes
 */
export class ClassParser {
  constructor(private readonly packagePath: string) {}

  public async parse(files: string[]): Promise<ClassRegistry> {
    const result: InspectedClass[] = [];
    const externalSources = new Map<string, string>();

    for (const file of files) {
      const content = await this.readContent(file);
      const classes = this.extractClasses(content, file);
      const imports = this.extractExternalImports(content);

      result.push(...classes);

      for (const [name, source] of imports) {
        externalSources.set(name, source);
      }
    }

    return new ClassRegistry(result, externalSources);
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
      const [fullMatch, jsdoc, abstractKeyword, name, parent, implementsStr] =
        match;
      const bodyStart = match.index + fullMatch.length;
      const body =
        this.extractDeclarationTail(content, bodyStart) +
        this.extractClassBody(content, bodyStart);

      results.push(
        new InspectedClass({
          name,
          file,
          layer,
          body,
          abstract: !!abstractKeyword,
          description: jsdoc ? this.parseJsDoc(jsdoc) : undefined,
          parent: parent ?? undefined,
          interfaces: implementsStr
            ? this.parseInterfaces(implementsStr)
            : undefined,
          fields: this.extractFieldTypes(body),
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

  private extractExternalImports(content: string): Map<string, string> {
    const IMPORT_PATTERN = /import\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]/g;
    const imports = new Map<string, string>();
    let importMatch: RegExpExecArray | null;

    while ((importMatch = IMPORT_PATTERN.exec(content)) !== null) {
      const [, names, source] = importMatch;

      if (source.startsWith('.')) continue;

      for (const raw of names.split(',')) {
        const name = raw
          .trim()
          .split(/\s+as\s+/)[0]
          .trim();

        if (name) imports.set(name, source);
      }
    }

    return imports;
  }

  private extractDeclarationTail(content: string, fromIndex: number): string {
    const bracePos = content.indexOf('{', fromIndex);
    return bracePos !== -1 ? content.slice(fromIndex, bracePos) : '';
  }

  private extractClassBody(content: string, fromIndex: number): string {
    let pos = fromIndex;

    while (pos < content.length && content[pos] !== '{') {
      pos++;
    }

    const bodyStart = pos + 1;
    let depth = 1;
    pos++;

    while (pos < content.length && depth > 0) {
      if (content[pos] === '{') {
        depth++;
      } else if (content[pos] === '}') {
        depth--;
      }
      pos++;
    }

    return content.slice(bodyStart, pos - 1);
  }

  private extractFieldTypes(body: string): string[] {
    const FIELD_PATTERN =
      /(?:private|protected|public|readonly)\s+(?:readonly\s+)?(?:\w+)\s*[?!]?\s*:\s*([\w]+)/g;
    const types = new Set<string>();
    let fieldMatch: RegExpExecArray | null;

    while ((fieldMatch = FIELD_PATTERN.exec(body)) !== null) {
      const type = fieldMatch[1];

      if (!PRIMITIVE_TYPES.has(type)) {
        types.add(type);
      }
    }

    return [...types];
  }
}
