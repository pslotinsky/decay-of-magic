import { ConflictError, NotFoundError } from '@dod/core';

import { CreateArchetypeCommand } from '../../src/law/commands/create-archetype.command';
import { UpdateArchetypeCommand } from '../../src/law/commands/update-archetype.command';
import { GetArchetypeQuery } from '../../src/law/queries/get-archetype.query';
import { ListArchetypesQuery } from '../../src/law/queries/list-archetypes.query';
import { ArchetypeKind } from '../../src/lore/entities/archetype.entity';
import { mocker } from '../helpers/mocker';
import { Bus, setupBus } from './setupBus';

describe('Element (flow)', () => {
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
        ArchetypeKind.Element,
        mocker.element.createBody(overrides),
      ),
    );

  it('creates and reads back an element', async () => {
    const created = await create();
    expect(created).toMatchObject({
      id: 'fire',
      universeId: 'eldoria',
      name: 'Fire',
    });

    const fetched = await bus.queryBus.execute(
      new GetArchetypeQuery(ArchetypeKind.Element, 'fire'),
    );
    expect(fetched).toEqual(created);
  });

  it('updates writable fields', async () => {
    await create();
    const updated = await bus.commandBus.execute(
      new UpdateArchetypeCommand(ArchetypeKind.Element, 'fire', {
        name: 'Inferno',
      }),
    );
    expect(updated).toMatchObject({ name: 'Inferno' });
  });

  it('rejects duplicate id within the same Universe', async () => {
    await create();
    await expect(create({ name: 'Flame' })).rejects.toBeInstanceOf(
      ConflictError,
    );
  });

  it('allows the same id in a different Universe', async () => {
    await create();
    await expect(
      create({ universeId: 'cyberDeal', name: 'Heat' }),
    ).resolves.toBeDefined();
  });

  it('lists only elements from the requested Universe', async () => {
    await create();
    await create({ id: 'credits', universeId: 'cyberDeal', name: 'Credits' });

    const list = await bus.queryBus.execute(
      new ListArchetypesQuery(ArchetypeKind.Element, 'eldoria'),
    );
    expect(list).toHaveLength(1);
    expect(list[0]).toMatchObject({ id: 'fire' });
  });

  it('returns empty list for an unknown Universe', async () => {
    await create();
    const list = await bus.queryBus.execute(
      new ListArchetypesQuery(ArchetypeKind.Element, 'ghost'),
    );
    expect(list).toEqual([]);
  });

  it('throws NotFoundError when getting an unknown id', async () => {
    await expect(
      bus.queryBus.execute(
        new GetArchetypeQuery(ArchetypeKind.Element, 'nope'),
      ),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it('throws NotFoundError when updating an unknown id', async () => {
    await expect(
      bus.commandBus.execute(
        new UpdateArchetypeCommand(ArchetypeKind.Element, 'nope', {
          name: 'X',
        }),
      ),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
