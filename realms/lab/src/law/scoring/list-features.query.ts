import { Inject } from '@nestjs/common';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';

import type { Feature } from '../../lore/scoring/feature';
import { FeatureCatalog } from '../../lore/scoring/feature-catalog';

export class ListFeaturesQuery extends Query<Feature[]> {
  public constructor(public readonly universeId: string) {
    super();
  }
}

@QueryHandler(ListFeaturesQuery)
export class ListFeaturesHandler implements IQueryHandler<ListFeaturesQuery> {
  @Inject() private readonly catalog!: FeatureCatalog;

  public async execute({ universeId }: ListFeaturesQuery): Promise<Feature[]> {
    return this.catalog.list(universeId);
  }
}
