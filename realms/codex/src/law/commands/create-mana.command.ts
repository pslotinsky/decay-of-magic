import { Inject } from '@nestjs/common';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreateManaDto } from '@/frontier/dto/body/create-mana.dto';
import { ManaDto } from '@/frontier/dto/mana.dto';
import { Mana } from '@/lore/entities/mana.entity';
import { ManaRepository } from '@/lore/repositories/mana.repository';

export class CreateManaCommand extends Command<ManaDto> {
  constructor(public readonly payload: CreateManaDto) {
    super();
  }
}

@CommandHandler(CreateManaCommand)
export class CreateManaHandler implements ICommandHandler<CreateManaCommand> {
  @Inject() private readonly manaRepository!: ManaRepository;

  public async execute({ payload }: CreateManaCommand): Promise<ManaDto> {
    const mana = Mana.create(payload);
    await this.manaRepository.save(mana);
    return ManaDto.from(mana);
  }
}
