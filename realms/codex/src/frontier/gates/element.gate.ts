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
  CreateElementDto,
  CreateElementSchema,
  ElementDto,
  UpdateElementDto,
  UpdateElementSchema,
} from '@dod/api-contract';
import { ZodBody } from '@dod/core';

@Controller('/v1/element')
export class ElementGate {
  @Post()
  @HttpCode(201)
  public create(
    @ZodBody(CreateElementSchema) _dto: CreateElementDto,
  ): Promise<ElementDto> {
    throw new Error('Not implemented');
  }

  @Patch('/:id')
  public update(
    @Param('id') _id: string,
    @ZodBody(UpdateElementSchema) _dto: UpdateElementDto,
  ): Promise<ElementDto> {
    throw new Error('Not implemented');
  }

  @Get('/:id')
  public getById(@Param('id') _id: string): Promise<ElementDto> {
    throw new Error('Not implemented');
  }

  @Get()
  public list(@Query('universeId') _universeId: string): Promise<ElementDto[]> {
    throw new Error('Not implemented');
  }
}
