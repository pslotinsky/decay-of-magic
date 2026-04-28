import { ConflictError, NotFoundError } from '@dod/core';

import { CreateArchetypeCommand } from '../../src/law/commands/create-archetype.command';
import { UpdateArchetypeCommand } from '../../src/law/commands/update-archetype.command';
import { GetArchetypeQuery } from '../../src/law/queries/get-archetype.query';
import { ListArchetypesQuery } from '../../src/law/queries/list-archetypes.query';
import { ArchetypeKind } from '../../src/lore/entities/archetype.entity';
import { mocker } from '../helpers/mocker';
import { Bus, setupBus } from './setupBus';

describe('Card (flow)', () => {
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
        ArchetypeKind.Card,
        mocker.card.createSummonBody(overrides),
      ),
    );

  it('creates and reads back a card preserving inline data', async () => {
    const created = await create();
    expect(created).toMatchObject({
      id: 'goblinBerserker',
      cost: { fire: 1 },
      stats: { attack: 4, health: 16 },
      activation: 'emptySlot',
    });

    const fetched = await bus.queryBus.execute(
      new GetArchetypeQuery(ArchetypeKind.Card, 'goblinBerserker'),
    );
    expect(fetched).toEqual(created);
  });

  it('updates writable fields and merges into existing data', async () => {
    await create();
    const updated = await bus.commandBus.execute(
      new UpdateArchetypeCommand(ArchetypeKind.Card, 'goblinBerserker', {
        name: 'Greater Goblin',
        factions: ['orderOfAsh'],
      }),
    );
    // patch-merge: name and factions update; cost / stats / activation preserved
    expect(updated).toMatchObject({
      name: 'Greater Goblin',
      factions: ['orderOfAsh'],
      cost: { fire: 1 },
      stats: { attack: 4, health: 16 },
      activation: 'emptySlot',
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

  it('lists only cards from the requested Universe', async () => {
    await create();
    await create({ id: 'cyberMinion', universeId: 'cyberDeal' });

    const list = await bus.queryBus.execute(
      new ListArchetypesQuery(ArchetypeKind.Card, 'eldoria'),
    );
    expect(list).toHaveLength(1);
    expect(list[0]).toMatchObject({ id: 'goblinBerserker' });
  });

  it('throws NotFoundError when getting an unknown id', async () => {
    await expect(
      bus.queryBus.execute(new GetArchetypeQuery(ArchetypeKind.Card, 'nope')),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
