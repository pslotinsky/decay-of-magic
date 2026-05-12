import type { Endpoint } from '../Endpoints/Endpoint';
import type { ExternalTypeLocation } from '../Scanner/ExternalTypeScanner';
import type { PrismaSchema } from '../Schema/PrismaSchema';
import type { InspectedClass } from './InspectedClass';

export type Location = {
  file: string;
  line: number;
};

/**
 * Collection of inspected classes plus any extracted endpoints and schema
 */
export class ClassRegistry {
  private readonly classMap: Map<string, InspectedClass>;
  constructor(
    public readonly items: InspectedClass[],
    public readonly externalSources: Map<string, string> = new Map(),
    public readonly endpoints: Endpoint[] = [],
    public readonly schema: PrismaSchema | undefined = undefined,
    public readonly externalTypes: Map<
      string,
      ExternalTypeLocation
    > = new Map(),
  ) {
    this.classMap = new Map(items.map((cls) => [cls.name, cls]));
  }

  public getExternalSource(name: string): string | undefined {
    return this.externalSources.get(name);
  }

  public getLocation(name: string): Location | undefined {
    const cls = this.classMap.get(name);

    if (cls) {
      return { file: cls.file, line: cls.line };
    }

    return this.externalTypes.get(name);
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

    return groups;
  }

  public getLayer(title: string): InspectedClass[] {
    return this.items.filter((cls) => cls.layer === title);
  }

  public getLayerEndpoints(title: string): Endpoint[] {
    return this.endpoints.filter((endpoint) => endpoint.layer === title);
  }
}
