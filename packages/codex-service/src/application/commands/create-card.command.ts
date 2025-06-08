import { Inject } from '@nestjs/common';
import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';

import { CreateCardDto } from '@service/api/dto/body/create-card.dto';
import { Card } from '@service/domain/entities/card.entity';
import { CardRepository } from '@service/domain/repositories/card.repository';

export class CreateCardCommand {
  constructor(public readonly payload: CreateCardDto) {}
}

@CommandHandler(CreateCardCommand)
export class CreateCardHandler implements ICommandHandler<CreateCardCommand> {
  @Inject() private readonly cardRepository: CardRepository;

  public async execute({ payload }: CreateCardCommand): Promise<void> {
    const card = Card.create(payload);
    await this.cardRepository.save(card);
  }
}
