import { Controller, HttpCode, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import {
  CreateSessionDto,
  CreateSessionSchema,
  SessionDto,
} from '@dod/api-contract';
import { ZodBody } from '@dod/core';

import { CreateSessionCommand } from '@/law/commands/create-session.command';

@Controller('/v1/session')
export class SessionGate {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @HttpCode(201)
  public async create(
    @ZodBody(CreateSessionSchema) dto: CreateSessionDto,
  ): Promise<SessionDto> {
    return this.commandBus.execute(new CreateSessionCommand(dto));
  }
}
