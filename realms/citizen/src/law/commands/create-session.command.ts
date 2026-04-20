import bcrypt from 'bcryptjs';
import { Inject } from '@nestjs/common';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';

import { CreateSessionDto, SessionDto } from '@dod/api-contract';
import { UnauthenticatedError } from '@dod/core';

import { CitizenRepository } from '@/lore/repositories/citizen.repository';
import { CitizenPermitRepository } from '@/lore/repositories/citizen-permit.repository';

export class CreateSessionCommand extends Command<SessionDto> {
  constructor(public readonly payload: CreateSessionDto) {
    super();
  }
}

@CommandHandler(CreateSessionCommand)
export class CreateSessionHandler implements ICommandHandler<CreateSessionCommand> {
  @Inject() private readonly citizenRepository!: CitizenRepository;
  @Inject() private readonly citizenPermitRepository!: CitizenPermitRepository;
  @Inject() private readonly jwtService!: JwtService;

  public async execute({ payload }: CreateSessionCommand): Promise<SessionDto> {
    const citizen = await this.findCitizenByNickname(payload.nickname);
    const permit = await this.loadPermit(citizen.id);

    await this.verifySecret(payload.secret, permit.secret);

    const accessToken = await this.jwtService.signAsync({ sub: citizen.id });

    return { accessToken };
  }

  private async findCitizenByNickname(nickname: string) {
    const [citizen] = await this.citizenRepository.find({ nickname });

    if (citizen === undefined) {
      throw new UnauthenticatedError('Invalid credentials');
    }

    return citizen;
  }

  private async loadPermit(citizenId: string) {
    const permit = await this.citizenPermitRepository.getById(citizenId);

    if (permit === undefined) {
      throw new UnauthenticatedError('Invalid credentials');
    }

    return permit;
  }

  private async verifySecret(secret: string, hash: string): Promise<void> {
    const valid = await bcrypt.compare(secret, hash);

    if (!valid) {
      throw new UnauthenticatedError('Invalid credentials');
    }
  }
}
