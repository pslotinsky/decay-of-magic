import {
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import {
  CreateFactionDto,
  CreateFactionSchema,
  FactionDto,
  UpdateFactionDto,
  UpdateFactionSchema,
} from '@dod/api-contract';
import { ZodBody } from '@dod/core';

@Controller('/v1/faction')
export class FactionGate {
  @Post()
  @HttpCode(201)
  public create(
    @ZodBody(CreateFactionSchema) _dto: CreateFactionDto,
  ): Promise<FactionDto> {
    throw new Error('Not implemented');
  }

  @Patch('/:id')
  public update(
    @Param('id') _id: string,
    @ZodBody(UpdateFactionSchema) _dto: UpdateFactionDto,
  ): Promise<FactionDto> {
    throw new Error('Not implemented');
  }

  @Get('/:id')
  public getById(@Param('id') _id: string): Promise<FactionDto> {
    throw new Error('Not implemented');
  }

  @Get()
  public list(@Query('universeId') _universeId: string): Promise<FactionDto[]> {
    throw new Error('Not implemented');
  }
}
