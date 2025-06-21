import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { CreateManaDto } from '@service/api/dto/body/create-mana.dto';
import { CreateManaCommand } from '@service/application/commands/create-mana.command';
import { GetManaQuery } from '@service/application/queries/get-mana.query';
import { FindManaQuery } from '@service/application/queries/find-mana.query';

import { ManaDto } from '../dto/mana.dto';

@Controller('/v1/mana')
@ApiTags('Mana')
export class ManaController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiCreatedResponse()
  public async create(@Body() dto: CreateManaDto): Promise<void> {
    await this.commandBus.execute(new CreateManaCommand(dto));
  }

  @Get('/:id')
  @ApiOkResponse({ type: ManaDto })
  public async getById(@Param('id') id: string): Promise<ManaDto> {
    return this.queryBus.execute(new GetManaQuery(id));
  }

  @Get('/')
  @ApiOkResponse({ type: [ManaDto] })
  public async find(): Promise<ManaDto[]> {
    return this.queryBus.execute(new FindManaQuery());
  }
}
