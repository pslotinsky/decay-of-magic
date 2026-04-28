import { ConflictError, NotFoundError } from '@dod/core';

import { CreateArchetypeCommand } from '../../src/law/commands/create-archetype.command';
import { UpdateArchetypeCommand } from '../../src/law/commands/update-archetype.command';
import { GetArchetypeQuery } from '../../src/law/queries/get-archetype.query';
import { ListArchetypesQuery } from '../../src/law/queries/list-archetypes.query';
import { ArchetypeKind } from '../../src/lore/entities/archetype.entity';
import { mocker } from '../helpers/mocker';
import { Bus, setupBus } from './setupBus';

describe('Stat (flow)', () => {
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
        ArchetypeKind.Stat,
        mocker.stat.createBody(overrides),
      ),
    );

  it('creates and reads back a stat with appliesTo', async () => {
    const created = await create({ appliesTo: ['minion', 'hero'] });
    expect(created).toMatchObject({
      id: 'attack',
      appliesTo: ['minion', 'hero'],
    });

    const fetched = await bus.queryBus.execute(
      new GetArchetypeQuery(ArchetypeKind.Stat, 'attack'),
    );
    expect(fetched).toEqual(created);
  });

  it('updates name and appliesTo independently', async () => {
    await create();
    const renamed = await bus.commandBus.execute(
      new UpdateArchetypeCommand(ArchetypeKind.Stat, 'attack', {
        appliesTo: ['hero', 'card'],
      }),
    );
    expect(renamed).toMatchObject({
      name: 'Attack',
      appliesTo: ['hero', 'card'],
    });
  });

  it('rejects duplicate id within the same Universe', async () => {
    await create();
    await expect(create({ name: 'Attack 2' })).rejects.toBeInstanceOf(
      ConflictError,
    );
  });

  it('lists only stats from the requested Universe', async () => {
    await create();
    await create({ universeId: 'cyberDeal' });

    const list = await bus.queryBus.execute(
      new ListArchetypesQuery(ArchetypeKind.Stat, 'eldoria'),
    );
    expect(list).toHaveLength(1);
    expect(list[0]).toMatchObject({ universeId: 'eldoria' });
  });

  it('throws NotFoundError when getting an unknown id', async () => {
    await expect(
      bus.queryBus.execute(new GetArchetypeQuery(ArchetypeKind.Stat, 'nope')),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
