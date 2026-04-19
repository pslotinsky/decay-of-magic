import { Endpoint } from '../Endpoints/Endpoint';
import { PrismaSchema } from '../Schema/PrismaSchema';
import { InspectedClass } from './InspectedClass';

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
  ) {
    this.classMap = new Map(items.map((cls) => [cls.name, cls]));
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

    return groups;
  }

  public getLayer(title: string): InspectedClass[] {
    return this.items.filter((cls) => cls.layer === title);
  }

  public getLayerEndpoints(title: string): Endpoint[] {
    return this.endpoints.filter((endpoint) => endpoint.layer === title);
  }
}
