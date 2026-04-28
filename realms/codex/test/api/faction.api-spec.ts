import { INestApplication } from '@nestjs/common';

import { FactionDto } from '@dod/api-contract';

import { getOk, http, patchOk, postOk } from '../helpers/http';
import { mocker } from '../helpers/mocker';
import { setupApp } from './setupApp';

describe('FactionGate (api)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await setupApp();
  });

  afterEach(async () => {
    await app.close();
  });

  it('creates a faction and reads it back', async () => {
    const created = await postOk<FactionDto>(
      app,
      '/api/v1/faction',
      mocker.faction.createBody(),
    );
    expect(created.id).toBe('orderOfAsh');

    const fetched = await getOk<FactionDto>(app, '/api/v1/faction/orderOfAsh');
    expect(fetched).toEqual(created);
  });

  it('updates a faction', async () => {
    await postOk(app, '/api/v1/faction', mocker.faction.createBody());
    const updated = await patchOk<FactionDto>(
      app,
      '/api/v1/faction/orderOfAsh',
      { name: 'Renamed' },
    );
    expect(updated.name).toBe('Renamed');
  });

  it('rejects duplicate id within the same Universe', async () => {
    await postOk(app, '/api/v1/faction', mocker.faction.createBody());
    await http(app)
      .post('/api/v1/faction')
      .send(mocker.faction.createBody({ name: 'Other' }))
      .expect(409);
  });

  it('allows the same id across different Universes', async () => {
    await postOk(app, '/api/v1/faction', mocker.faction.createBody());
    await postOk(
      app,
      '/api/v1/faction',
      mocker.faction.createBody({ universeId: 'cyberDeal', name: 'Order' }),
    );
  });

  it('lists only factions from the requested Universe', async () => {
    await postOk(app, '/api/v1/faction', mocker.faction.createBody());
    await postOk(
      app,
      '/api/v1/faction',
      mocker.faction.createBody({
        id: 'neonSyndicate',
        universeId: 'cyberDeal',
        name: 'Neon Syndicate',
      }),
    );
    const list = await getOk<FactionDto[]>(
      app,
      '/api/v1/faction?universeId=eldoria',
    );
    expect(list.map((faction) => faction.id)).toEqual(['orderOfAsh']);
  });

  it('returns 404 for unknown id', () =>
    http(app).get('/api/v1/faction/nope').expect(404));
});
