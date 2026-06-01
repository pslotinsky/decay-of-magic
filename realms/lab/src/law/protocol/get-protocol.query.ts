import { Inject } from '@nestjs/common';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';

import { Protocol } from '../../lore/protocol/protocol.entity';
import { ProtocolRepository } from '../../lore/protocol/protocol.repository';

export class GetProtocolQuery extends Query<Protocol> {
  public constructor(public readonly id: string) {
    super();
  }
}

@QueryHandler(GetProtocolQuery)
export class GetProtocolHandler implements IQueryHandler<GetProtocolQuery> {
  @Inject() private readonly protocols!: ProtocolRepository;

  public async execute({ id }: GetProtocolQuery): Promise<Protocol> {
    return this.protocols.getByIdOrFail(id);
  }
}
