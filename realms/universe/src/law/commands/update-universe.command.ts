import { Inject } from '@nestjs/common';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ConflictError } from '@dod/core';

import { UpdateUniverseDto } from '@/frontier/dto/body/update-universe.dto';
import { UniverseDto } from '@/frontier/dto/universe.dto';
import { UniverseRepository } from '@/lore/repositories/universe.repository';

export class UpdateUniverseCommand extends Command<UniverseDto> {
  constructor(
    public readonly id: string,
    public readonly payload: UpdateUniverseDto,
  ) {
    super();
  }
}

@CommandHandler(UpdateUniverseCommand)
export class UpdateUniverseHandler implements ICommandHandler<UpdateUniverseCommand> {
  @Inject() private readonly universeRepository!: UniverseRepository;

  public async execute({
    id,
    payload,
  }: UpdateUniverseCommand): Promise<UniverseDto> {
    const universe = await this.universeRepository.getByIdOrFail(id);

    if (payload.name !== undefined) {
      await this.assertNameAvailable(payload.name, id);
    }

    universe.update(payload);

    await this.universeRepository.save(universe);

    return UniverseDto.from(universe);
  }

  private async assertNameAvailable(
    name: string,
    currentId: string,
  ): Promise<void> {
    const conflicting = await this.universeRepository.findOne({ name });

    if (conflicting !== undefined && conflicting.id !== currentId) {
      throw new ConflictError(`Universe name "${name}" already taken`);
    }
  }
}
