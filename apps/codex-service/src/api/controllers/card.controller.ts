import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { CreateCardDto } from '@service/api/dto/body/create-card.dto';
import { CreateCardCommand } from '@service/application/commands/create-card.command';
import { GetCardQuery } from '@service/application/queries/get-card.query';
import { FindCardsQuery } from '@service/application/queries/find-cards.query';

import { CardDto } from '../dto/card.dto';

@Controller('/v1/card')
@ApiTags('Card')
export class CardController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiCreatedResponse()
  public async create(@Body() dto: CreateCardDto): Promise<void> {
    await this.commandBus.execute(new CreateCardCommand(dto));
  }

  @Get('/:id')
  @ApiOkResponse({ type: CardDto })
  public async getById(@Param('id') id: string): Promise<CardDto> {
    return this.queryBus.execute(new GetCardQuery(id));
  }

  @Get('/')
  @ApiOkResponse({ type: [CardDto] })
  public async find(): Promise<CardDto[]> {
    return this.queryBus.execute(new FindCardsQuery());
  }
}
