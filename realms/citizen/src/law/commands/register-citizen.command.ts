import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { Inject } from '@nestjs/common';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import {
  CitizenDto,
  CitizenSchema,
  RegisterCitizenDto,
} from '@dod/api-contract';
import { ConflictError } from '@dod/core';

import { Citizen } from '@/lore/entities/citizen.entity';
import { CitizenPermit } from '@/lore/entities/citizen-permit.entity';
import { CitizenRepository } from '@/lore/repositories/citizen.repository';
import { CitizenPermitRepository } from '@/lore/repositories/citizen-permit.repository';

export class RegisterCitizenCommand extends Command<CitizenDto> {
  constructor(public readonly payload: RegisterCitizenDto) {
    super();
  }
}

@CommandHandler(RegisterCitizenCommand)
export class RegisterCitizenHandler implements ICommandHandler<RegisterCitizenCommand> {
  @Inject() private readonly citizenRepository!: CitizenRepository;
  @Inject() private readonly citizenPermitRepository!: CitizenPermitRepository;

  public async execute({
    payload,
  }: RegisterCitizenCommand): Promise<CitizenDto> {
    await this.assertNicknameAvailable(payload.nickname);

    const id = crypto.randomUUID();
    const citizen = Citizen.create({ id, nickname: payload.nickname });
    await this.citizenRepository.save(citizen);

    const secret = await bcrypt.hash(payload.secret, 10);
    const permit = CitizenPermit.create({ id, secret, issuedAt: new Date() });
    await this.citizenPermitRepository.save(permit);

    return CitizenSchema.parse(citizen);
  }

  private async assertNicknameAvailable(nickname: string): Promise<void> {
    const [existing] = await this.citizenRepository.find({ nickname });
    if (existing !== undefined) {
      throw new ConflictError(`Nickname ${nickname} already taken`);
    }
  }
}
