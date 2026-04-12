import { Controller, Get, HttpCode, Post, Body } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { BearerToken } from '@/frontier/decorators/bearer-token.decorator';
import { CreateSessionDto } from '@/frontier/dto/body/create-session.dto';
import { TokenPayloadDto } from '@/frontier/dto/token-payload.dto';
import { CreateSessionCommand } from '@/law/commands/create-session.command';
import { ValidateTokenQuery } from '@/law/queries/validate-token.query';

import { SessionDto } from '../dto/session.dto';

@Controller('/v1/session')
@ApiTags('Session')
export class SessionGate {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @HttpCode(201)
  @ApiCreatedResponse({ type: SessionDto })
  public async create(@Body() dto: CreateSessionDto): Promise<SessionDto> {
    return this.commandBus.execute(new CreateSessionCommand(dto));
  }

  @Get()
  @HttpCode(200)
  @ApiOkResponse({ type: TokenPayloadDto })
  public async validate(
    @BearerToken() token: string,
  ): Promise<TokenPayloadDto> {
    return this.queryBus.execute(new ValidateTokenQuery(token));
  }
}
