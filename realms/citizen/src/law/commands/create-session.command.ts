import { Inject, UnauthorizedException } from '@nestjs/common';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';

import { CreateSessionDto } from '@/frontier/dto/body/create-session.dto';
import { SessionDto } from '@/frontier/dto/session.dto';
import { CitizenPermitRepository } from '@/lore/repositories/citizen-permit.repository';
import { CitizenRepository } from '@/lore/repositories/citizen.repository';

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

    const accessToken = this.jwtService.sign({ sub: citizen.id });

    return { accessToken };
  }

  private async findCitizenByNickname(nickname: string) {
    const [citizen] = await this.citizenRepository.find({ nickname });

    if (citizen === undefined) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return citizen;
  }

  private async loadPermit(citizenId: string) {
    const permit = await this.citizenPermitRepository.getById(citizenId);

    if (permit === undefined) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return permit;
  }

  private async verifySecret(secret: string, hash: string): Promise<void> {
    const valid = await bcrypt.compare(secret, hash);

    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
