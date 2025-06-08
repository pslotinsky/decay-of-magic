import { Inject } from '@nestjs/common';
import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';

import { CreateMagicSchoolDto } from '@service/api/dto/body/create-magic-school.dto';
import { MagicSchool } from '@service/domain/entities/magic-school.entity';
import { MagicSchoolRepository } from '@service/domain/repositories/magic-school.repository';

export class CreateMagicSchoolCommand {
  constructor(public readonly payload: CreateMagicSchoolDto) {}
}

@CommandHandler(CreateMagicSchoolCommand)
export class CreateMagicSchoolHandler
  implements ICommandHandler<CreateMagicSchoolCommand>
{
  @Inject() private readonly schoolRepository: MagicSchoolRepository;

  public async execute({ payload }: CreateMagicSchoolCommand): Promise<void> {
    const school = MagicSchool.create(payload);
    await this.schoolRepository.save(school);
  }
}
