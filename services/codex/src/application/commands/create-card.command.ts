import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';

import { CreateCardDto } from '@api/dto/create-card.dto';
import { Card } from '@domain/entities/card.entity';
import { CardRepository } from '@domain/repositories/card.repository';

export class CreateCardCommand {
  constructor(public readonly payload: CreateCardDto) {}
}

@CommandHandler(CreateCardCommand)
export class CreateCardHandler implements ICommandHandler<CreateCardCommand> {
  constructor(private readonly cardRepository: CardRepository) {}

  public async execute({ payload }: CreateCardCommand): Promise<void> {
    const card = Card.create(payload);
    await this.cardRepository.save(card);
  }
}
