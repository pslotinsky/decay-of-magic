import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { CreateMagicSchoolDto } from '@service/api/dto/body/create-magic-school.dto';
import { CreateMagicSchoolCommand } from '@service/application/commands/create-magic-school.command';
import { GetMagicSchoolQuery } from '@service/application/queries/get-magic-school.query';
import { FindMagicSchoolsQuery } from '@service/application/queries/find-magic-school.query';

import { MagicSchoolDto } from '../dto/magic-school.dto';

@Controller('/v1/magic-school')
@ApiTags('MagicSchool')
export class MagicSchoolController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiCreatedResponse()
  public async create(@Body() dto: CreateMagicSchoolDto): Promise<void> {
    await this.commandBus.execute(new CreateMagicSchoolCommand(dto));
  }

  @Get('/:id')
  @ApiOkResponse({ type: MagicSchoolDto })
  public async getById(@Param('id') id: string): Promise<MagicSchoolDto> {
    return this.queryBus.execute(new GetMagicSchoolQuery(id));
  }

  @Get('/')
  @ApiOkResponse({ type: [MagicSchoolDto] })
  public async find(): Promise<MagicSchoolDto[]> {
    return this.queryBus.execute(new FindMagicSchoolsQuery());
  }
}
