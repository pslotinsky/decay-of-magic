import { INestApplication } from '@nestjs/common';

import { HeroDto } from '@dod/api-contract';

import { getOk, http, patchOk, postOk } from '../helpers/http';
import { mocker } from '../helpers/mocker';
import { seedCodex } from '../helpers/seed';
import { setupApp } from './setupApp';

describe('HeroGate (api)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await setupApp();
    await seedCodex(app);
  });

  afterEach(async () => {
    await app.close();
  });

  it('creates a hero and reads it back with elements', async () => {
    const created = await postOk<HeroDto>(
      app,
      '/api/v1/hero',
      mocker.hero.createBody(),
    );
    expect(created.elements).toEqual({ fire: 5, water: 5 });

    const fetched = await getOk<HeroDto>(app, '/api/v1/hero/archmage');
    expect(fetched).toEqual(created);
  });

  it('updates a hero', async () => {
    await postOk(app, '/api/v1/hero', mocker.hero.createBody());
    const updated = await patchOk<HeroDto>(app, '/api/v1/hero/archmage', {
      name: 'Renamed',
    });
    expect(updated.name).toBe('Renamed');
  });

  it('rejects duplicate id within the same Universe', async () => {
    await postOk(app, '/api/v1/hero', mocker.hero.createBody());
    await http(app)
      .post('/api/v1/hero')
      .send(mocker.hero.createBody())
      .expect(409);
  });

  it('allows the same id across different Universes', async () => {
    await seedCodex(app, 'cyberDeal');
    await postOk(app, '/api/v1/hero', mocker.hero.createBody());
    await postOk(
      app,
      '/api/v1/hero',
      mocker.hero.createBody({ universeId: 'cyberDeal' }),
    );
  });

  it('lists only heroes from the requested Universe', async () => {
    await seedCodex(app, 'cyberDeal');
    await postOk(app, '/api/v1/hero', mocker.hero.createBody());
    await postOk(
      app,
      '/api/v1/hero',
      mocker.hero.createBody({ id: 'cyberHero', universeId: 'cyberDeal' }),
    );
    const list = await getOk<HeroDto[]>(app, '/api/v1/hero?universeId=eldoria');
    expect(list.map((hero) => hero.id)).toEqual(['archmage']);
  });

  it('returns 404 for unknown id', () =>
    http(app).get('/api/v1/hero/nope').expect(404));
});
