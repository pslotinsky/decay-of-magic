import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

import { CreateSessionDto } from '@/frontier/dto/body/create-session.dto';
import { SessionDto } from '@/frontier/dto/session.dto';
import { CreateSessionCommand } from '@/law/commands/create-session.command';

@Controller('/v1/session')
@ApiTags('Session')
export class SessionGate {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @HttpCode(201)
  @ApiCreatedResponse({ type: SessionDto })
  public async create(@Body() dto: CreateSessionDto): Promise<SessionDto> {
    return this.commandBus.execute(new CreateSessionCommand(dto));
  }
}
