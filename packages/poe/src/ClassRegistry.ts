import { InspectedClass } from './InspectedClass';

/**
 * Collection of inspected classes
 */
export class ClassRegistry {
  private readonly classMap: Map<string, InspectedClass>;

  constructor(public readonly items: InspectedClass[]) {
    this.classMap = new Map(items.map((cls) => [cls.name, cls]));
  }

  public get isEmpty(): boolean {
    return this.items.length === 0;
  }

  public get(name: string): InspectedClass | undefined {
    return this.classMap.get(name);
  }
}
