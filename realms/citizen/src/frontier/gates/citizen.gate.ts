import { Controller, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import {
  CitizenDto,
  RegisterCitizenDto,
  RegisterCitizenSchema,
  UpdateCitizenDto,
  UpdateCitizenSchema,
} from '@dod/api-contract';
import { ZodBody } from '@dod/core';

import { RegisterCitizenCommand } from '@/law/commands/register-citizen.command';
import { UpdateCitizenCommand } from '@/law/commands/update-citizen.command';
import { GetCitizenQuery } from '@/law/queries/get-citizen.query';
import { ListCitizensQuery } from '@/law/queries/list-citizens.query';

@Controller('/v1/citizen')
export class CitizenGate {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @HttpCode(201)
  public async register(
    @ZodBody(RegisterCitizenSchema) dto: RegisterCitizenDto,
  ): Promise<CitizenDto> {
    return this.commandBus.execute(new RegisterCitizenCommand(dto));
  }

  @Patch('/:id')
  public async update(
    @Param('id') id: string,
    @ZodBody(UpdateCitizenSchema) dto: UpdateCitizenDto,
  ): Promise<CitizenDto> {
    return this.commandBus.execute(new UpdateCitizenCommand(id, dto));
  }

  @Get('/:id')
  public async getById(@Param('id') id: string): Promise<CitizenDto> {
    return this.queryBus.execute(new GetCitizenQuery(id));
  }

  @Get()
  public async list(): Promise<CitizenDto[]> {
    return this.queryBus.execute(new ListCitizensQuery());
  }
}
