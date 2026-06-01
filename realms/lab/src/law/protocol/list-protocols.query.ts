import { Inject } from '@nestjs/common';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';

import { Protocol } from '../../lore/protocol/protocol.entity';
import { ProtocolRepository } from '../../lore/protocol/protocol.repository';

export class ListProtocolsQuery extends Query<Protocol[]> {}

@QueryHandler(ListProtocolsQuery)
export class ListProtocolsHandler implements IQueryHandler<ListProtocolsQuery> {
  @Inject() private readonly protocols!: ProtocolRepository;

  public async execute(): Promise<Protocol[]> {
    return this.protocols.find();
  }
}
