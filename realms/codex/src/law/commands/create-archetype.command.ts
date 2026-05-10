import { Inject } from '@nestjs/common';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ConflictError } from '@dod/core';

import { ArchetypeFactory } from '@/lore/archetype-factory';
import { ArchetypeKind } from '@/lore/entities/archetype.entity';
import { ArchetypeRepository } from '@/lore/repositories/archetype.repository';

export class CreateArchetypeCommand<TDto = unknown> extends Command<TDto> {
  constructor(
    public readonly kind: ArchetypeKind,
    public readonly payload: { id: string; universeId: string } & Record<
      string,
      unknown
    >,
  ) {
    super();
  }
}

@CommandHandler(CreateArchetypeCommand)
export class CreateArchetypeHandler implements ICommandHandler<CreateArchetypeCommand> {
  @Inject() private readonly archetypeRepository!: ArchetypeRepository;
  @Inject() private readonly archetypeFactory!: ArchetypeFactory;

  public async execute({
    kind,
    payload,
  }: CreateArchetypeCommand): Promise<unknown> {
    await this.assertIdAvailable(payload.id, payload.universeId);

    const archetype = this.archetypeFactory.create(kind, payload);

    await this.archetypeRepository.save(archetype);

    return archetype.toDto();
  }

  private async assertIdAvailable(
    id: string,
    universeId: string,
  ): Promise<void> {
    const existing = await this.archetypeRepository.findOne({
      id,
      universeId,
    });

    if (existing !== undefined) {
      throw new ConflictError(
        `Archetype "${id}" already exists in universe "${universeId}"`,
      );
    }
  }
}
