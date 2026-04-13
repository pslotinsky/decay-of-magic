import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Command, Option } from 'nestjs-command';

import { CitizenDto } from '@/frontier/dto/citizen.dto';
import { RegisterCitizenCommand } from '@/law/commands/register-citizen.command';

@Injectable()
export class CreateCitizenCli {
  constructor(private readonly commandBus: CommandBus) {}

  @Command({ command: 'citizen:create', describe: 'Register a new citizen' })
  public async create(
    @Option({ name: 'nickname', describe: 'Citizen nickname', type: 'string', demandOption: true }) nickname: string,
    @Option({ name: 'password', describe: 'Citizen password', type: 'string', demandOption: true }) password: string,
  ): Promise<void> {
    const citizen = await this.commandBus.execute<CitizenDto>(
      new RegisterCitizenCommand({ nickname, password }),
    );
    console.log(`Citizen created — id: ${citizen.id}, nickname: ${citizen.nickname}`);
  }
}
