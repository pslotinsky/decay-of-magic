import { Inject } from '@nestjs/common';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ConflictError } from '@dod/core';

import { CreateUniverseDto } from '@/frontier/dto/body/create-universe.dto';
import { UniverseDto } from '@/frontier/dto/universe.dto';
import { Universe } from '@/lore/entities/universe.entity';
import { UniverseRepository } from '@/lore/repositories/universe.repository';

export class CreateUniverseCommand extends Command<UniverseDto> {
  constructor(public readonly payload: CreateUniverseDto) {
    super();
  }
}

@CommandHandler(CreateUniverseCommand)
export class CreateUniverseHandler implements ICommandHandler<CreateUniverseCommand> {
  @Inject() private readonly universeRepository!: UniverseRepository;

  public async execute({
    payload,
  }: CreateUniverseCommand): Promise<UniverseDto> {
    await this.assertNameAvailable(payload.name);

    const universe = Universe.create(payload);

    await this.universeRepository.save(universe);

    return UniverseDto.from(universe);
  }

  private async assertNameAvailable(name: string): Promise<void> {
    const existing = await this.universeRepository.findOne({ name });

    if (existing !== undefined) {
      throw new ConflictError(`Universe name "${name}" already taken`);
    }
  }
}
