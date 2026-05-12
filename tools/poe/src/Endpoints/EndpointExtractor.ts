import { ScannedFile } from '../Scanner/ScannedFile';
import { Endpoint } from './Endpoint';

const CONTROLLER_PATTERN =
  /@Controller\((?:['"]([^'"]+)['"])?\)\s*(?:export\s+)?class\s+(\w+)/g;

const HTTP_VERB_PATTERN =
  /@(Get|Post|Put|Patch|Delete|Options|Head)\((?:['"]([^'"]*)['"])?\)/g;

const METHOD_SIGNATURE_PATTERN =
  /(public|protected|private)\s+(?:async\s+)?(\w+)\s*\(/g;

/**
 * Parses controller source files and extracts HTTP endpoints
 */
export class EndpointExtractor {
  public extract(file: ScannedFile): Endpoint[] {
    const endpoints: Endpoint[] = [];
    const content = file.content;

    for (const controller of this.findControllers(content)) {
      endpoints.push(
        ...this.extractFromController(
          file.path,
          file.layer,
          controller.className,
          controller.basePath,
          controller.body,
        ),
      );
    }

    return endpoints;
  }

  private findControllers(content: string): Array<{
    className: string;
    basePath: string;
    body: string;
  }> {
    const controllers: Array<{
      className: string;
      basePath: string;
      body: string;
    }> = [];

    CONTROLLER_PATTERN.lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = CONTROLLER_PATTERN.exec(content)) !== null) {
      const basePath = match[1] ?? '';
      const className = match[2];
      const bodyStart = content.indexOf('{', match.index + match[0].length);

      if (bodyStart === -1) continue;

      const body = this.extractBracedBlock(content, bodyStart);

      controllers.push({ className, basePath, body });
    }

    return controllers;
  }

  private extractFromController(
    file: string,
    layer: string,
    className: string,
    basePath: string,
    body: string,
  ): Endpoint[] {
    const endpoints: Endpoint[] = [];

    HTTP_VERB_PATTERN.lastIndex = 0;
    let verbMatch: RegExpExecArray | null;

    while ((verbMatch = HTTP_VERB_PATTERN.exec(body)) !== null) {
      const method = verbMatch[1].toUpperCase();
      const subPath = verbMatch[2] ?? '';
      const path = this.joinPath(basePath, subPath);

      const signature = this.findMethodSignature(body, verbMatch.index);

      if (!signature) continue;

      const description = this.findPrecedingJsdoc(body, verbMatch.index);

      endpoints.push(
        new Endpoint(
          file,
          layer,
          className,
          method,
          path,
          signature.name,
          signature.params,
          signature.returns,
          description,
        ),
      );
    }

    return endpoints;
  }

  private findMethodSignature(
    body: string,
    fromIndex: number,
  ): { name: string; params: string; returns?: string } | undefined {
    METHOD_SIGNATURE_PATTERN.lastIndex = fromIndex;
    const match = METHOD_SIGNATURE_PATTERN.exec(body);

    if (!match) return undefined;

    const name = match[2];
    const openParenIndex = match.index + match[0].length - 1;
    const closeParenIndex = this.findMatchingParen(body, openParenIndex);

    if (closeParenIndex === -1) return undefined;

    const params = this.stripParams(
      body.slice(openParenIndex + 1, closeParenIndex),
    );
    const returns = this.extractReturnType(body, closeParenIndex + 1);

    return { name, params, returns };
  }

  private stripParams(raw: string): string {
    const collapsed = raw.replace(/\s+/g, ' ').trim();

    if (!collapsed) return '';

    // Split on top-level commas and strip decorators/defaults from each part
    const parts = this.splitTopLevel(collapsed, ',');

    return parts
      .map((part) => this.stripParamAnnotations(part))
      .filter(Boolean)
      .join(', ');
  }

  private stripParamAnnotations(param: string): string {
    // Drop decorator annotations like "@ZodBody(Schema) " or "@Param('id') "
    let result = param.replace(/@\w+\([^)]*\)\s*/g, '');
    // Drop default-value assignments
    const eq = result.indexOf('=');
    if (eq !== -1) result = result.slice(0, eq);
    return result.trim();
  }

  private extractReturnType(
    body: string,
    fromIndex: number,
  ): string | undefined {
    let pos = fromIndex;

    while (pos < body.length && /\s/.test(body[pos])) pos++;

    if (body[pos] !== ':') return undefined;

    pos++;
    while (pos < body.length && /\s/.test(body[pos])) pos++;

    const start = pos;
    let depth = 0;

    while (pos < body.length) {
      const ch = body[pos];
      if (ch === '<') depth++;
      else if (ch === '>') depth--;
      else if (depth === 0 && (ch === '{' || ch === ';' || ch === '\n')) break;
      pos++;
    }

    const raw = body.slice(start, pos).trim();
    return this.unwrapPromise(raw);
  }

  private unwrapPromise(type: string): string {
    const match = /^Promise<([\s\S]*)>$/.exec(type);
    return match ? match[1].trim() : type;
  }

  private findPrecedingJsdoc(
    body: string,
    fromIndex: number,
  ): string | undefined {
    // Scan backward to the start of the decorator block, then find the jsdoc
    // that immediately precedes it.
    let pos = fromIndex;

    // Walk back to find the start of the decorator/method block
    while (pos > 0) {
      const prev = body.slice(0, pos).trimEnd();
      const lastLineStart = prev.lastIndexOf('\n') + 1;
      const line = prev.slice(lastLineStart).trimStart();

      if (line.startsWith('@') || line === '') {
        pos = lastLineStart;
      } else if (line.endsWith('*/')) {
        // Found jsdoc end; read the full jsdoc
        const jsdocEnd = prev.length;
        const jsdocStart = body.lastIndexOf('/**', jsdocEnd);
        if (jsdocStart === -1) return undefined;
        const raw = body.slice(jsdocStart + 3, jsdocEnd - 2);
        return this.parseJsdoc(raw);
      } else {
        return undefined;
      }
    }

    return undefined;
  }

  private parseJsdoc(raw: string): string | undefined {
    const comment = raw
      .split('\n')
      .map((line) => line.replace(/^\s*\*\s?/, '').trim())
      .filter((line) => line.length > 0 && !line.startsWith('@'))
      .join('<br>');

    return comment.length > 0 ? comment : undefined;
  }

  private joinPath(base: string, sub: string): string {
    const normalizedBase = base.replace(/\/$/, '');
    const normalizedSub = sub.startsWith('/') || sub === '' ? sub : `/${sub}`;
    const joined = `${normalizedBase}${normalizedSub}`;
    return joined || '/';
  }

  private findMatchingParen(content: string, openIndex: number): number {
    let depth = 1;
    let pos = openIndex + 1;

    while (pos < content.length && depth > 0) {
      const ch = content[pos];
      if (ch === '(') depth++;
      else if (ch === ')') depth--;
      pos++;
    }

    return depth === 0 ? pos - 1 : -1;
  }

  private extractBracedBlock(content: string, openIndex: number): string {
    let depth = 1;
    let pos = openIndex + 1;
    const start = pos;

    while (pos < content.length && depth > 0) {
      const ch = content[pos];
      if (ch === '{') depth++;
      else if (ch === '}') depth--;
      pos++;
    }

    return content.slice(start, pos - 1);
  }

  private splitTopLevel(text: string, separator: string): string[] {
    const parts: string[] = [];
    let depth = 0;
    let current = '';

    for (const ch of text) {
      if (ch === '(' || ch === '<' || ch === '[' || ch === '{') depth++;
      else if (ch === ')' || ch === '>' || ch === ']' || ch === '}') depth--;

      if (ch === separator && depth === 0) {
        parts.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }

    if (current.trim()) parts.push(current.trim());

    return parts;
  }
}
