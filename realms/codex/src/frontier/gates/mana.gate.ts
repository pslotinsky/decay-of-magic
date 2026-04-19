import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { CreateManaDto } from '@/frontier/dto/body/create-mana.dto';
import { ManaDto } from '@/frontier/dto/mana.dto';
import { CreateManaCommand } from '@/law/commands/create-mana.command';
import { GetManaQuery } from '@/law/queries/get-mana.query';
import { ListManaQuery } from '@/law/queries/list-mana.query';

@Controller('/v1/mana')
@ApiTags('Mana')
export class ManaGate {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @HttpCode(201)
  @ApiCreatedResponse({ type: ManaDto })
  public async create(@Body() dto: CreateManaDto): Promise<ManaDto> {
    return this.commandBus.execute(new CreateManaCommand(dto));
  }

  @Get('/:id')
  @ApiOkResponse({ type: ManaDto })
  public async getById(@Param('id') id: string): Promise<ManaDto> {
    return this.queryBus.execute(new GetManaQuery(id));
  }

  @Get()
  @ApiOkResponse({ type: [ManaDto] })
  public async list(): Promise<ManaDto[]> {
    return this.queryBus.execute(new ListManaQuery());
  }
}
