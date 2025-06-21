import { Inject } from '@nestjs/common';
import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';

import { CreateManaDto } from '@service/api/dto/body/create-mana.dto';
import { Mana } from '@service/domain/entities/mana.entity';
import { ManaRepository } from '@service/domain/repositories/mana.repository';

export class CreateManaCommand {
  constructor(public readonly payload: CreateManaDto) {}
}

@CommandHandler(CreateManaCommand)
export class CreateManaHandler implements ICommandHandler<CreateManaCommand> {
  @Inject() private readonly manaRepository: ManaRepository;

  public async execute({ payload }: CreateManaCommand): Promise<void> {
    const entity = Mana.create(payload);
    await this.manaRepository.save(entity);
  }
}
