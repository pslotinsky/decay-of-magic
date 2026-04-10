export type Visibility = 'public' | 'protected' | 'private';

/**
 * Represents a single field, getter, or method of an inspected class
 */
export class InspectedClassMember {
  constructor(
    public readonly name: string,
    public readonly visibility: Visibility,
    public readonly isMethod: boolean,
    public readonly type?: string,
  ) {}

  public get prefix(): string {
    switch (this.visibility) {
      case 'public':
        return '+';
      case 'protected':
        return '#';
      case 'private':
        return '-';
      default:
        return '';
    }
  }

  public toString(): string {
    if (this.isMethod) {
      return `${this.prefix}${this.name}()`;
    }

    const label = this.type ? `${this.type} ${this.name}` : this.name;

    return `${this.prefix}${label}`;
  }
}
