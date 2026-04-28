import { ConflictError, NotFoundError } from '@dod/core';

import { CreateArchetypeCommand } from '../../src/law/commands/create-archetype.command';
import { UpdateArchetypeCommand } from '../../src/law/commands/update-archetype.command';
import { GetArchetypeQuery } from '../../src/law/queries/get-archetype.query';
import { ListArchetypesQuery } from '../../src/law/queries/list-archetypes.query';
import { ArchetypeKind } from '../../src/lore/entities/archetype.entity';
import { mocker } from '../helpers/mocker';
import { Bus, setupBus } from './setupBus';

describe('Trait (flow)', () => {
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
        ArchetypeKind.Trait,
        mocker.trait.createBody(overrides),
      ),
    );

  it('creates and reads back a trait with appliesTo', async () => {
    const created = await create({ appliesTo: ['minion', 'hero'] });
    expect(created).toMatchObject({
      id: 'wall',
      appliesTo: ['minion', 'hero'],
    });

    const fetched = await bus.queryBus.execute(
      new GetArchetypeQuery(ArchetypeKind.Trait, 'wall'),
    );
    expect(fetched).toEqual(created);
  });

  it('updates appliesTo', async () => {
    await create();
    const updated = await bus.commandBus.execute(
      new UpdateArchetypeCommand(ArchetypeKind.Trait, 'wall', {
        appliesTo: ['hero', 'card'],
      }),
    );
    expect(updated).toMatchObject({ appliesTo: ['hero', 'card'] });
  });

  it('rejects duplicate id within the same Universe', async () => {
    await create();
    await expect(create({ name: 'Wall 2' })).rejects.toBeInstanceOf(
      ConflictError,
    );
  });

  it('lists only traits from the requested Universe', async () => {
    await create();
    await create({ universeId: 'cyberDeal' });

    const list = await bus.queryBus.execute(
      new ListArchetypesQuery(ArchetypeKind.Trait, 'eldoria'),
    );
    expect(list).toHaveLength(1);
    expect(list[0]).toMatchObject({ universeId: 'eldoria' });
  });

  it('throws NotFoundError when getting an unknown id', async () => {
    await expect(
      bus.queryBus.execute(new GetArchetypeQuery(ArchetypeKind.Trait, 'nope')),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
