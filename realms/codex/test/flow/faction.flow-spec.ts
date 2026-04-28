import { ConflictError, NotFoundError } from '@dod/core';

import { CreateArchetypeCommand } from '../../src/law/commands/create-archetype.command';
import { UpdateArchetypeCommand } from '../../src/law/commands/update-archetype.command';
import { GetArchetypeQuery } from '../../src/law/queries/get-archetype.query';
import { ListArchetypesQuery } from '../../src/law/queries/list-archetypes.query';
import { ArchetypeKind } from '../../src/lore/entities/archetype.entity';
import { mocker } from '../helpers/mocker';
import { Bus, setupBus } from './setupBus';

describe('Faction (flow)', () => {
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
        ArchetypeKind.Faction,
        mocker.faction.createBody(overrides),
      ),
    );

  it('creates and reads back a faction', async () => {
    const created = await create();
    expect(created).toMatchObject({ id: 'orderOfAsh', name: 'Order of Ash' });

    const fetched = await bus.queryBus.execute(
      new GetArchetypeQuery(ArchetypeKind.Faction, 'orderOfAsh'),
    );
    expect(fetched).toEqual(created);
  });

  it('updates writable fields', async () => {
    await create();
    const updated = await bus.commandBus.execute(
      new UpdateArchetypeCommand(ArchetypeKind.Faction, 'orderOfAsh', {
        name: 'Renamed',
      }),
    );
    expect(updated).toMatchObject({ name: 'Renamed' });
  });

  it('rejects duplicate id within the same Universe', async () => {
    await create();
    await expect(create({ name: 'Other' })).rejects.toBeInstanceOf(
      ConflictError,
    );
  });

  it('allows the same id in a different Universe', async () => {
    await create();
    await expect(
      create({ universeId: 'cyberDeal', name: 'Order' }),
    ).resolves.toBeDefined();
  });

  it('lists only factions from the requested Universe', async () => {
    await create();
    await create({
      id: 'neonSyndicate',
      universeId: 'cyberDeal',
      name: 'Neon Syndicate',
    });

    const list = await bus.queryBus.execute(
      new ListArchetypesQuery(ArchetypeKind.Faction, 'eldoria'),
    );
    expect(list).toHaveLength(1);
    expect(list[0]).toMatchObject({ id: 'orderOfAsh' });
  });

  it('throws NotFoundError when getting an unknown id', async () => {
    await expect(
      bus.queryBus.execute(
        new GetArchetypeQuery(ArchetypeKind.Faction, 'nope'),
      ),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
