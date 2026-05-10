import { ConflictError, NotFoundError } from '@dod/core';

import { CreateArchetypeCommand } from '../../src/law/commands/create-archetype.command';
import { UpdateArchetypeCommand } from '../../src/law/commands/update-archetype.command';
import { GetArchetypeQuery } from '../../src/law/queries/get-archetype.query';
import { ListArchetypesQuery } from '../../src/law/queries/list-archetypes.query';
import { ArchetypeKind } from '../../src/lore/entities/archetype.entity';
import { mocker } from '../helpers/mocker';
import { Bus, setupBus } from './setupBus';

describe('Hero (flow)', () => {
  let bus: Bus;

  beforeEach(async () => {
    bus = await setupBus();
  });

  afterEach(async () => {
    await bus.close();
  });

  const create = (overrides = {}) =>
    bus.commandBus.execute(
      new CreateArchetypeCommand(
        ArchetypeKind.Hero,
        mocker.hero.createBody(overrides),
      ),
    );

  it('creates and reads back a hero with elements', async () => {
    const created = await create();
    expect(created).toMatchObject({
      id: 'archmage',
      elements: { fire: 5, water: 5 },
    });

    const fetched = await bus.queryBus.execute(
      new GetArchetypeQuery(ArchetypeKind.Hero, 'archmage'),
    );
    expect(fetched).toEqual(created);
  });

  it('updates writable fields and merges into existing data', async () => {
    await create();
    const updated = await bus.commandBus.execute(
      new UpdateArchetypeCommand(ArchetypeKind.Hero, 'archmage', {
        name: 'Renamed',
        faction: 'orderOfAsh',
      }),
    );
    expect(updated).toMatchObject({
      name: 'Renamed',
      faction: 'orderOfAsh',
      elements: { fire: 5, water: 5 },
    });
  });

  it('rejects duplicate id within the same Universe', async () => {
    await create();
    await expect(create()).rejects.toBeInstanceOf(ConflictError);
  });

  it('allows the same id in a different Universe', async () => {
    await create();
    await expect(create({ universeId: 'cyberDeal' })).resolves.toBeDefined();
  });

  it('lists only heroes from the requested Universe', async () => {
    await create();
    await create({ id: 'cyberHero', universeId: 'cyberDeal' });

    const list = await bus.queryBus.execute(
      new ListArchetypesQuery(ArchetypeKind.Hero, 'eldoria'),
    );
    expect(list).toHaveLength(1);
    expect(list[0]).toMatchObject({ id: 'archmage' });
  });

  it('throws NotFoundError when getting an unknown id', async () => {
    await expect(
      bus.queryBus.execute(new GetArchetypeQuery(ArchetypeKind.Hero, 'nope')),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
