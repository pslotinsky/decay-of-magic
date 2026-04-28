import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';

import { InMemoryArchetypeRepository } from '../../src/ground/repositories/in-memory-archetype.repository';
import { CreateArchetypeHandler } from '../../src/law/commands/create-archetype.command';
import { UpdateArchetypeHandler } from '../../src/law/commands/update-archetype.command';
import { GetArchetypeHandler } from '../../src/law/queries/get-archetype.query';
import { ListArchetypesHandler } from '../../src/law/queries/list-archetypes.query';
import { ArchetypeFactory } from '../../src/lore/archetype-factory';
import { ArchetypeRepository } from '../../src/lore/repositories/archetype.repository';

export type Bus = {
  commandBus: CommandBus;
  queryBus: QueryBus;
  close: () => Promise<void>;
};

export async function setupBus(): Promise<Bus> {
  const moduleRef = await Test.createTestingModule({
    imports: [CqrsModule],
    providers: [
      CreateArchetypeHandler,
      UpdateArchetypeHandler,
      GetArchetypeHandler,
      ListArchetypesHandler,
      ArchetypeFactory,
      { provide: ArchetypeRepository, useClass: InMemoryArchetypeRepository },
    ],
  }).compile();

  await moduleRef.init();

  return {
    commandBus: moduleRef.get(CommandBus),
    queryBus: moduleRef.get(QueryBus),
    close: () => moduleRef.close(),
  };
}
