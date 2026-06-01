import { Inject } from '@nestjs/common';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Protocol } from '../../lore/protocol/protocol.entity';
import { ProtocolRepository } from '../../lore/protocol/protocol.repository';

export type ProtocolChanges = Partial<
  Pick<Protocol, 'name' | 'sides' | 'turnLimit'>
>;

export class UpdateProtocolCommand extends Command<Protocol> {
  public constructor(
    public readonly id: string,
    public readonly changes: ProtocolChanges,
  ) {
    super();
  }
}

@CommandHandler(UpdateProtocolCommand)
export class UpdateProtocolHandler
  implements ICommandHandler<UpdateProtocolCommand>
{
  @Inject() private readonly protocols!: ProtocolRepository;

  public async execute({
    id,
    changes,
  }: UpdateProtocolCommand): Promise<Protocol> {
    const protocol = await this.protocols.getByIdOrFail(id);

    protocol.update(changes);

    await this.protocols.save(protocol);

    return protocol;
  }
}
