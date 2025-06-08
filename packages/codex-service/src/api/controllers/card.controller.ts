import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { CreateCardDto } from '@service/api/dto/create-card.dto';
import { CreateCardCommand } from '@service/application/commands/create-card.command';
import { GetCardQuery } from '@service/application/queries/get-card.query';
import { FindCardsQuery } from '@service/application/queries/find-cards.query';

@Controller('/v1/card')
export class CardController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  public async create(@Body() dto: CreateCardDto): Promise<void> {
    await this.commandBus.execute(new CreateCardCommand(dto));
  }

  @Get('/:id')
  public async getById(@Param('id') id: string) {
    return this.queryBus.execute(new GetCardQuery(id));
  }

  @Get('/')
  public async find() {
    return this.queryBus.execute(new FindCardsQuery());
  }
}
