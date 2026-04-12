import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { RegisterCitizenDto } from '@/frontier/dto/body/register-citizen.dto';
import { UpdateCitizenDto } from '@/frontier/dto/body/update-citizen.dto';
import { RegisterCitizenCommand } from '@/law/commands/register-citizen.command';
import { UpdateCitizenCommand } from '@/law/commands/update-citizen.command';
import { GetCitizenQuery } from '@/law/queries/get-citizen.query';
import { ListCitizensQuery } from '@/law/queries/list-citizens.query';

import { CitizenDto } from '../dto/citizen.dto';

@Controller('/v1/citizen')
@ApiTags('Citizen')
export class CitizenGate {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @HttpCode(201)
  @ApiCreatedResponse({ type: CitizenDto })
  public async register(@Body() dto: RegisterCitizenDto): Promise<CitizenDto> {
    return this.commandBus.execute(new RegisterCitizenCommand(dto));
  }

  @Patch('/:id')
  @ApiOkResponse({ type: CitizenDto })
  public async update(
    @Param('id') id: string,
    @Body() dto: UpdateCitizenDto,
  ): Promise<CitizenDto> {
    return this.commandBus.execute(new UpdateCitizenCommand(id, dto));
  }

  @Get('/:id')
  @ApiOkResponse({ type: CitizenDto })
  public async getById(@Param('id') id: string): Promise<CitizenDto> {
    return this.queryBus.execute(new GetCitizenQuery(id));
  }

  @Get()
  @ApiOkResponse({ type: [CitizenDto] })
  public async list(): Promise<CitizenDto[]> {
    return this.queryBus.execute(new ListCitizensQuery());
  }
}
