import { Inject } from '@nestjs/common';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import {
  UniverseDto,
  UniverseSchema,
  UpdateUniverseDto,
} from '@dod/api-contract';
import { ConflictError } from '@dod/core';

import { UniverseRepository } from '@/lore/repositories/universe.repository';

/**
 * Updates an existing universe. Only fields present in the payload
 * are changed. Fails if the new name collides with another universe
 */
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

    return UniverseSchema.parse(universe);
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
