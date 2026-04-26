import { Inject } from '@nestjs/common';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { pickDefined } from '@dod/core/collection';

import { Archetype, ArchetypeKind } from '@/lore/entities/archetype.entity';
import { ArchetypeRepository } from '@/lore/repositories/archetype.repository';

export class UpdateArchetypeCommand<TDto = unknown> extends Command<TDto> {
  constructor(
    public readonly kind: ArchetypeKind,
    public readonly id: string,
    public readonly payload: Record<string, unknown>,
  ) {
    super();
  }
}

@CommandHandler(UpdateArchetypeCommand)
export class UpdateArchetypeHandler implements ICommandHandler<UpdateArchetypeCommand> {
  @Inject() private readonly archetypeRepository!: ArchetypeRepository;

  public async execute({
    kind,
    id,
    payload,
  }: UpdateArchetypeCommand): Promise<unknown> {
    const archetype = await this.archetypeRepository.findOneOrFail({
      id,
      kind,
    });

    const normalized = this.normalize(archetype, payload);
    archetype.update(normalized);

    await this.archetypeRepository.save(archetype);

    return archetype.toDto();
  }

  private normalize(
    archetype: Archetype,
    payload: Record<string, unknown>,
  ): Partial<Archetype> {
    if (!('data' in archetype)) {
      return payload as Partial<Archetype>;
    }

    const { name, ...rest } = payload;
    return {
      name,
      data: { ...(archetype.data as object), ...pickDefined(rest) },
    } as Partial<Archetype>;
  }
}
