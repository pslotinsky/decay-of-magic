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
  CreateStatDto,
  CreateStatSchema,
  StatDto,
  UpdateStatDto,
  UpdateStatSchema,
} from '@dod/api-contract';
import { ZodBody } from '@dod/core';

@Controller('/v1/stat')
export class StatGate {
  @Post()
  @HttpCode(201)
  public create(
    @ZodBody(CreateStatSchema) _dto: CreateStatDto,
  ): Promise<StatDto> {
    throw new Error('Not implemented');
  }

  @Patch('/:id')
  public update(
    @Param('id') _id: string,
    @ZodBody(UpdateStatSchema) _dto: UpdateStatDto,
  ): Promise<StatDto> {
    throw new Error('Not implemented');
  }

  @Get('/:id')
  public getById(@Param('id') _id: string): Promise<StatDto> {
    throw new Error('Not implemented');
  }

  @Get()
  public list(@Query('universeId') _universeId: string): Promise<StatDto[]> {
    throw new Error('Not implemented');
  }
}
