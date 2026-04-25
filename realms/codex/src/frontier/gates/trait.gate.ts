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
  CreateTraitDto,
  CreateTraitSchema,
  TraitDto,
  UpdateTraitDto,
  UpdateTraitSchema,
} from '@dod/api-contract';
import { ZodBody } from '@dod/core';

@Controller('/v1/trait')
export class TraitGate {
  @Post()
  @HttpCode(201)
  public create(
    @ZodBody(CreateTraitSchema) _dto: CreateTraitDto,
  ): Promise<TraitDto> {
    throw new Error('Not implemented');
  }

  @Patch('/:id')
  public update(
    @Param('id') _id: string,
    @ZodBody(UpdateTraitSchema) _dto: UpdateTraitDto,
  ): Promise<TraitDto> {
    throw new Error('Not implemented');
  }

  @Get('/:id')
  public getById(@Param('id') _id: string): Promise<TraitDto> {
    throw new Error('Not implemented');
  }

  @Get()
  public list(@Query('universeId') _universeId: string): Promise<TraitDto[]> {
    throw new Error('Not implemented');
  }
}
