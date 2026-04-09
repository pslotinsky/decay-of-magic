import { ClassRegistry } from '../ClassRegistry';
import { InspectedClass } from '../InspectedClass/InspectedClass';
import { InspectedClassRelation } from '../InspectedClass/InspectedClassRelation';

/**
 * Builds relations between inspected classes and enriches them with the results
 */
export class RelationBuilder {
  private readonly registry: ClassRegistry;
  private readonly knownNames: Set<string>;

  constructor(registry: ClassRegistry) {
    this.registry = registry;
    this.knownNames = new Set(registry.items.map((cls) => cls.name));
  }

  public buildRelations(): ClassRegistry {
    const enriched = this.registry.items.map((cls) =>
      InspectedClass.withRelations(cls, this.toRelations(cls)),
    );

    return new ClassRegistry(enriched, this.registry.externalSources);
  }

  private toRelations(cls: InspectedClass): InspectedClassRelation[] {
    const relations: InspectedClassRelation[] = [];

    if (cls.parent) {
      relations.push(new InspectedClassRelation(cls.name, cls.parent, '--|>'));
    }

    for (const iface of cls.interfaces ?? []) {
      if (this.knownNames.has(iface)) {
        relations.push(new InspectedClassRelation(cls.name, iface, '..|>'));
      }
    }

    for (const fieldType of cls.fields ?? []) {
      if (this.knownNames.has(fieldType)) {
        relations.push(new InspectedClassRelation(cls.name, fieldType, '*--'));
      }
    }

    for (const other of this.registry.items) {
      if (!other.isEqual(cls) && this.hasUsageRelation(cls, other)) {
        relations.push(new InspectedClassRelation(cls.name, other.name, '-->'));
      }
    }

    return relations;
  }

  private hasUsageRelation(
    cls: InspectedClass,
    other: InspectedClass,
  ): boolean {
    return (
      !this.isKnownRelation(cls, other.name) && cls.body.includes(other.name)
    );
  }

  private isKnownRelation(cls: InspectedClass, name: string): boolean {
    return (
      name === cls.parent ||
      (cls.interfaces ?? []).includes(name) ||
      (cls.fields ?? []).includes(name)
    );
  }
}
