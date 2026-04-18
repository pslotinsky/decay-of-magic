import { InspectedClass } from '../ClassRegistry/InspectedClass';
import {
  InspectedClassMember,
  Visibility,
} from '../ClassRegistry/InspectedClassMember';
import { ScannedFile } from '../Scanner/ScannedFile';

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
 * Parses a single scanned file and extracts class definitions and imports
 */
export class ClassParser {
  constructor(private readonly file: ScannedFile) {}

  public classes(): InspectedClass[] {
    const pattern = new RegExp(CLASS_PATTERN.source, 'gm');
    const layer = this.getLayer(this.file.path);
    const results: InspectedClass[] = [];
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(this.file.content)) !== null) {
      const [fullMatch, jsdoc, abstractKeyword, name, parent, implementsStr] =
        match;
      const bodyStart = match.index + fullMatch.length;
      const body =
        this.extractDeclarationTail(this.file.content, bodyStart) +
        this.extractClassBody(this.file.content, bodyStart);

      results.push(
        new InspectedClass({
          name,
          file: this.file.path,
          layer,
          body,
          abstract: !!abstractKeyword,
          description: jsdoc ? this.parseJsDoc(jsdoc) : undefined,
          parent: parent ?? undefined,
          interfaces: implementsStr
            ? this.parseInterfaces(implementsStr)
            : undefined,
          fields: this.extractFieldTypes(body),
          members: this.extractMembers(body),
        }),
      );
    }

    return results;
  }

  public imports(): Map<string, string> {
    const IMPORT_PATTERN = /import\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]/g;
    const result = new Map<string, string>();
    let match: RegExpExecArray | null;

    while ((match = IMPORT_PATTERN.exec(this.file.content)) !== null) {
      const [, names, source] = match;

      if (source.startsWith('.')) continue;

      for (const raw of names.split(',')) {
        const name = raw
          .trim()
          .split(/\s+as\s+/)[0]
          .trim();

        if (name) result.set(name, source);
      }
    }

    return result;
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

  private findClassBodyStart(content: string, fromIndex: number): number {
    let pos = fromIndex;
    let angleDepth = 0;

    while (pos < content.length) {
      const ch = content[pos];
      if (ch === '<') angleDepth++;
      else if (ch === '>') angleDepth--;
      else if (ch === '{' && angleDepth === 0) return pos;
      pos++;
    }

    return -1;
  }

  private extractDeclarationTail(content: string, fromIndex: number): string {
    const bracePos = this.findClassBodyStart(content, fromIndex);
    return bracePos !== -1 ? content.slice(fromIndex, bracePos) : '';
  }

  private extractClassBody(content: string, fromIndex: number): string {
    const bodyOpen = this.findClassBodyStart(content, fromIndex);

    if (bodyOpen === -1) return '';

    let pos = bodyOpen + 1;
    const bodyStart = pos;
    let depth = 1;

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

  private extractMembers(body: string): InspectedClassMember[] {
    const members: InspectedClassMember[] = [];
    const seen = new Set<string>();
    let match: RegExpExecArray | null;

    // Fields: [public|protected|private] [readonly] name[?!]: Type
    const FIELD_PATTERN =
      /^\s*(public|protected|private)\s+(?:readonly\s+)?(\w+)\s*[?!]?\s*:\s*(\w+)/gm;

    while ((match = FIELD_PATTERN.exec(body)) !== null) {
      const [, vis, name, type] = match;
      if (!seen.has(name)) {
        seen.add(name);
        members.push(
          new InspectedClassMember(name, vis as Visibility, false, type),
        );
      }
    }

    // Constructor parameter properties: constructor(public readonly name: Type, ...)
    const CTOR_PROP_PATTERN =
      /[,(]\s*(public|protected|private)\s+(?:readonly\s+)?(\w+)\s*[?!]?\s*:\s*(\w+)/g;

    while ((match = CTOR_PROP_PATTERN.exec(body)) !== null) {
      const [, vis, name, type] = match;
      if (!seen.has(name)) {
        seen.add(name);
        members.push(
          new InspectedClassMember(name, vis as Visibility, false, type),
        );
      }
    }

    // Getters: [public|protected|private] get name()[: Type]
    const GETTER_PATTERN =
      /^\s*(public|protected|private)\s+get\s+(\w+)\s*\(\)\s*(?::\s*(\w+))?/gm;

    while ((match = GETTER_PATTERN.exec(body)) !== null) {
      const [, vis, name, type] = match;
      if (!seen.has(name)) {
        seen.add(name);
        members.push(
          new InspectedClassMember(name, vis as Visibility, false, type),
        );
      }
    }

    // Methods: [public|protected|private] [abstract] [override] [async] name<T>([...])
    const METHOD_PATTERN =
      /^\s*(public|protected|private)\s+(?:abstract\s+)?(?:override\s+)?(?:async\s+)?(\w+)\s*(?:<[^>]*>)?\s*\(/gm;

    while ((match = METHOD_PATTERN.exec(body)) !== null) {
      const [, vis, name] = match;
      if (name === 'constructor' || name === 'get' || name === 'set') continue;
      if (!seen.has(name)) {
        seen.add(name);
        members.push(new InspectedClassMember(name, vis as Visibility, true));
      }
    }

    return members;
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
