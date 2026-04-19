import { Inject } from '@nestjs/common';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CardDto, CardSchema, CreateCardDto } from '@dod/api-contract';

import { Card } from '@/lore/entities/card.entity';
import { CardRepository } from '@/lore/repositories/card.repository';

export class CreateCardCommand extends Command<CardDto> {
  constructor(public readonly payload: CreateCardDto) {
    super();
  }
}

@CommandHandler(CreateCardCommand)
export class CreateCardHandler implements ICommandHandler<CreateCardCommand> {
  @Inject() private readonly cardRepository!: CardRepository;

  public async execute({ payload }: CreateCardCommand): Promise<CardDto> {
    const card = Card.create(payload);
    await this.cardRepository.save(card);
    return CardSchema.parse(card);
  }
}
