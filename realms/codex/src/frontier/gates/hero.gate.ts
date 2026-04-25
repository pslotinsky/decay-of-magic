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
  CreateHeroDto,
  CreateHeroSchema,
  HeroDto,
  UpdateHeroDto,
  UpdateHeroSchema,
} from '@dod/api-contract';
import { ZodBody } from '@dod/core';

@Controller('/v1/hero')
export class HeroGate {
  @Post()
  @HttpCode(201)
  public create(
    @ZodBody(CreateHeroSchema) _dto: CreateHeroDto,
  ): Promise<HeroDto> {
    throw new Error('Not implemented');
  }

  @Patch('/:id')
  public update(
    @Param('id') _id: string,
    @ZodBody(UpdateHeroSchema) _dto: UpdateHeroDto,
  ): Promise<HeroDto> {
    throw new Error('Not implemented');
  }

  @Get('/:id')
  public getById(@Param('id') _id: string): Promise<HeroDto> {
    throw new Error('Not implemented');
  }

  @Get()
  public list(@Query('universeId') _universeId: string): Promise<HeroDto[]> {
    throw new Error('Not implemented');
  }
}
