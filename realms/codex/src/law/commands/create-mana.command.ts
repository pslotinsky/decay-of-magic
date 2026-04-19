import { Inject } from '@nestjs/common';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreateManaDto, ManaDto, ManaSchema } from '@dod/api-contract';

import { Mana, ManaType } from '@/lore/entities/mana.entity';
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
    const mana = Mana.create({ ...payload, type: payload.type as ManaType });
    await this.manaRepository.save(mana);
    return ManaSchema.parse(mana);
  }
}
