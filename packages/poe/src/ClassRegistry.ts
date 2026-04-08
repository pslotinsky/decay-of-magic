import { InspectedClass } from './InspectedClass';

/**
 * Collection of inspected classes
 */
export class ClassRegistry {
  private readonly classMap: Map<string, InspectedClass>;
  private readonly externalSources: Map<string, string>;

  constructor(
    public readonly items: InspectedClass[],
    externalSources: Map<string, string> = new Map(),
  ) {
    this.classMap = new Map(items.map((cls) => [cls.name, cls]));
    this.externalSources = externalSources;
  }

  public getExternalSource(name: string): string | undefined {
    return this.externalSources.get(name);
  }

  public get isEmpty(): boolean {
    return this.items.length === 0;
  }

  public get(name: string): InspectedClass | undefined {
    return this.classMap.get(name);
  }

  public get layers(): Record<string, InspectedClass[]> {
    const groups: Record<string, InspectedClass[]> = {};

    for (const cls of this.items) {
      (groups[cls.layer] ??= []).push(cls);
    }

    const { root, ...layers } = groups;

    return root ? { ...layers, root } : layers;
  }
}
