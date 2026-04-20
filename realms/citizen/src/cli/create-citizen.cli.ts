import { Command, Option } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { CitizenDto } from '@dod/api-contract';

import { RegisterCitizenCommand } from '@/law/commands/register-citizen.command';

@Injectable()
export class CreateCitizenCli {
  constructor(private readonly commandBus: CommandBus) {}

  @Command({ command: 'citizen:create', describe: 'Register a new citizen' })
  public async create(
    @Option({
      name: 'nickname',
      describe: 'Citizen nickname',
      type: 'string',
      demandOption: true,
    })
    nickname: string,
    @Option({
      name: 'secret',
      describe: 'Citizen secret',
      type: 'string',
      demandOption: true,
    })
    secret: string,
  ): Promise<void> {
    const citizen = await this.commandBus.execute<CitizenDto>(
      new RegisterCitizenCommand({ nickname, secret }),
    );
    console.log(
      `Citizen created — id: ${citizen.id}, nickname: ${citizen.nickname}`,
    );
  }
}
