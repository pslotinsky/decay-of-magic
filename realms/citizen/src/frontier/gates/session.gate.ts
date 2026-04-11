import { CommandBus } from '@nestjs/cqrs';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

import { CreateSessionDto } from '@/frontier/dto/body/create-session.dto';
import { CreateSessionCommand } from '@/law/commands/create-session.command';

import { SessionDto } from '../dto/session.dto';

@Controller('/v1/sessions')
@ApiTags('Sessions')
export class SessionGate {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @HttpCode(201)
  @ApiCreatedResponse({ type: SessionDto })
  public async create(@Body() dto: CreateSessionDto): Promise<SessionDto> {
    return this.commandBus.execute(new CreateSessionCommand(dto));
  }
}
