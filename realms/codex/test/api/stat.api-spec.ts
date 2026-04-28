import { INestApplication } from '@nestjs/common';

import { StatDto } from '@dod/api-contract';

import { getOk, http, patchOk, postOk } from '../helpers/http';
import { mocker } from '../helpers/mocker';
import { setupApp } from './setupApp';

describe('StatGate (api)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await setupApp();
  });

  afterEach(async () => {
    await app.close();
  });

  it('creates a stat and reads it back, preserving appliesTo', async () => {
    const created = await postOk<StatDto>(
      app,
      '/api/v1/stat',
      mocker.stat.createBody({ appliesTo: ['minion', 'hero'] }),
    );
    expect(created.appliesTo).toEqual(['minion', 'hero']);

    const fetched = await getOk<StatDto>(app, '/api/v1/stat/attack');
    expect(fetched.appliesTo).toEqual(['minion', 'hero']);
  });

  it('updates a stat', async () => {
    await postOk(app, '/api/v1/stat', mocker.stat.createBody());
    const updated = await patchOk<StatDto>(app, '/api/v1/stat/attack', {
      name: 'Renamed',
      appliesTo: ['hero', 'card'],
    });
    expect(updated.name).toBe('Renamed');
    expect(updated.appliesTo).toEqual(['hero', 'card']);
  });

  it('rejects duplicate id within the same Universe', async () => {
    await postOk(app, '/api/v1/stat', mocker.stat.createBody());
    await http(app)
      .post('/api/v1/stat')
      .send(mocker.stat.createBody({ name: 'Attack 2' }))
      .expect(409);
  });

  it('allows the same id across different Universes', async () => {
    await postOk(app, '/api/v1/stat', mocker.stat.createBody());
    await postOk(
      app,
      '/api/v1/stat',
      mocker.stat.createBody({ universeId: 'cyberDeal' }),
    );
  });

  it('lists only stats from the requested Universe', async () => {
    await postOk(app, '/api/v1/stat', mocker.stat.createBody());
    await postOk(
      app,
      '/api/v1/stat',
      mocker.stat.createBody({ universeId: 'cyberDeal' }),
    );
    const list = await getOk<StatDto[]>(app, '/api/v1/stat?universeId=eldoria');
    expect(list).toHaveLength(1);
    expect(list[0]?.universeId).toBe('eldoria');
  });

  it('returns 404 for unknown id', () =>
    http(app).get('/api/v1/stat/nope').expect(404));
});
