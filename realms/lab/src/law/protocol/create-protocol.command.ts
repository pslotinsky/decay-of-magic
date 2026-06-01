import { Inject } from '@nestjs/common';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import {
  Protocol,
  type ProtocolParams,
} from '../../lore/protocol/protocol.entity';
import { ProtocolRepository } from '../../lore/protocol/protocol.repository';

export class CreateProtocolCommand extends Command<Protocol> {
  public constructor(public readonly params: ProtocolParams) {
    super();
  }
}

@CommandHandler(CreateProtocolCommand)
export class CreateProtocolHandler
  implements ICommandHandler<CreateProtocolCommand>
{
  @Inject() private readonly protocols!: ProtocolRepository;

  public async execute({ params }: CreateProtocolCommand): Promise<Protocol> {
    const protocol = new Protocol(params);

    await this.protocols.save(protocol);

    return protocol;
  }
}
