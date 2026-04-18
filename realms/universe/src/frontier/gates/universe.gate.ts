import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { CreateUniverseDto } from '@/frontier/dto/body/create-universe.dto';
import { UpdateUniverseDto } from '@/frontier/dto/body/update-universe.dto';
import { UniverseDto } from '@/frontier/dto/universe.dto';
import { CreateUniverseCommand } from '@/law/commands/create-universe.command';
import { UpdateUniverseCommand } from '@/law/commands/update-universe.command';
import { GetUniverseQuery } from '@/law/queries/get-universe.query';
import { ListUniversesQuery } from '@/law/queries/list-universes.query';

@Controller('/v1/universe')
@ApiTags('Universe')
export class UniverseGate {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @HttpCode(201)
  @ApiCreatedResponse({ type: UniverseDto })
  public async create(@Body() dto: CreateUniverseDto): Promise<UniverseDto> {
    return this.commandBus.execute(new CreateUniverseCommand(dto));
  }

  @Patch('/:id')
  @ApiOkResponse({ type: UniverseDto })
  public async update(
    @Param('id') id: string,
    @Body() dto: UpdateUniverseDto,
  ): Promise<UniverseDto> {
    return this.commandBus.execute(new UpdateUniverseCommand(id, dto));
  }

  @Get('/:id')
  @ApiOkResponse({ type: UniverseDto })
  public async getById(@Param('id') id: string): Promise<UniverseDto> {
    return this.queryBus.execute(new GetUniverseQuery(id));
  }

  @Get()
  @ApiOkResponse({ type: [UniverseDto] })
  public async list(): Promise<UniverseDto[]> {
    return this.queryBus.execute(new ListUniversesQuery());
  }
}
