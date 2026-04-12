import { Inject } from '@nestjs/common';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UpdateCitizenDto } from '@/frontier/dto/body/update-citizen.dto';
import { CitizenDto } from '@/frontier/dto/citizen.dto';
import { CitizenRepository } from '@/lore/repositories/citizen.repository';

export class UpdateCitizenCommand extends Command<CitizenDto> {
  constructor(
    public readonly id: string,
    public readonly payload: UpdateCitizenDto,
  ) {
    super();
  }
}

@CommandHandler(UpdateCitizenCommand)
export class UpdateCitizenHandler implements ICommandHandler<UpdateCitizenCommand> {
  @Inject() private readonly citizenRepository!: CitizenRepository;

  public async execute({
    id,
    payload,
  }: UpdateCitizenCommand): Promise<CitizenDto> {
    const citizen = await this.citizenRepository.getByIdOrFail(id);

    citizen.update(payload);

    await this.citizenRepository.save(citizen);

    return CitizenDto.from(citizen);
  }
}
