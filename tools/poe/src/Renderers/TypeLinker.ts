import type { ClassRegistry } from '../ClassRegistry/ClassRegistry';

const TYPE_PATTERN = /\b[A-Z]\w*\b/g;

/**
 * Renders a type-bearing signature fragment with markdown links
 * for any referenced type the registry knows about
 */
export class TypeLinker {
  constructor(private readonly registry: ClassRegistry) {}

  public renderType(type: string): string {
    const wrapped = type.replace(TYPE_PATTERN, (name) => {
      const location = this.registry.getLocation(name);
      return location
        ? `[\`${name}\`](${location.file}#L${location.line})`
        : `\`${name}\``;
    });

    return wrapped === type ? `\`${type}\`` : wrapped;
  }

  public renderParam(param: string): string {
    const colon = param.indexOf(':');

    if (colon === -1) {
      return param;
    }

    const name = param.slice(0, colon).trim();
    const type = param.slice(colon + 1).trim();

    return `\`${name}\`: ${this.renderType(type)}`;
  }

  public renderSignature(
    params: readonly string[],
    returnType: string | undefined,
  ): string[] {
    const lines: string[] = [];

    for (const param of params) {
      lines.push(`Param ${this.escape(this.renderParam(param))}`);
    }

    if (returnType) {
      lines.push(`Returns: ${this.escape(this.renderType(returnType))}`);
    }

    return lines;
  }

  private escape(text: string): string {
    return text.replace(/\|/g, '\\|');
  }
}
