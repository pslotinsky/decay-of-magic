import { INestApplication } from '@nestjs/common';

import { HeroDto } from '@dod/api-contract';

import { getOk, http, patchOk, postOk } from './helpers/http';
import { mocker } from './helpers/mocker';
import { seedCodex } from './helpers/seed';
import { setupApp } from './helpers/setupApp';

describe('HeroGate (api)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await setupApp();
    await seedCodex(app);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /api/v1/hero', () => {
    it('creates the resource and returns it', async () => {
      const created = await postOk<HeroDto>(
        app,
        '/api/v1/hero',
        mocker.hero.createBody(),
      );
      expect(created.id).toBe('archmage');
      expect(created.elements).toEqual({ fire: 5, water: 5 });
    });

    it('returns 400 when universeId is missing', () =>
      http(app)
        .post('/api/v1/hero')
        .send({ ...mocker.hero.createBody(), universeId: undefined })
        .expect(400));

    it('returns 400 when name is missing', () =>
      http(app)
        .post('/api/v1/hero')
        .send({ ...mocker.hero.createBody(), name: undefined })
        .expect(400));

    it('returns 400 when name is empty', () =>
      http(app)
        .post('/api/v1/hero')
        .send({ ...mocker.hero.createBody(), name: '' })
        .expect(400));

    it('returns 400 when name exceeds max length', () =>
      http(app)
        .post('/api/v1/hero')
        .send({ ...mocker.hero.createBody(), name: 'a'.repeat(101) })
        .expect(400));

    it('returns 409 when id already exists in the same Universe', async () => {
      await postOk(app, '/api/v1/hero', mocker.hero.createBody());
      await http(app)
        .post('/api/v1/hero')
        .send(mocker.hero.createBody())
        .expect(409);
    });

    it('allows the same id in a different Universe', async () => {
      await seedCodex(app, 'cyberDeal');
      await postOk(app, '/api/v1/hero', mocker.hero.createBody());
      await postOk(
        app,
        '/api/v1/hero',
        mocker.hero.createBody({ universeId: 'cyberDeal' }),
      );
    });

    describe('elements', () => {
      it('accepts an elements map referencing existing Elements', async () => {
        await postOk(
          app,
          '/api/v1/hero',
          mocker.hero.createBody({ elements: { fire: 3 } }),
        );
      });

      it('returns 400 when any elements amount is negative', () =>
        http(app)
          .post('/api/v1/hero')
          .send(mocker.hero.createBody({ elements: { fire: -1 } }))
          .expect(400));
    });

    describe('faction', () => {
      it('accepts zero or one faction', async () => {
        await postOk(app, '/api/v1/hero', mocker.hero.createBody());
        await postOk(
          app,
          '/api/v1/hero',
          mocker.hero.createBody({ id: 'guardian', faction: 'orderOfAsh' }),
        );
      });
    });
  });

  describe('PATCH /api/v1/hero/:id', () => {
    beforeEach(async () => {
      await postOk(app, '/api/v1/hero', mocker.hero.createBody());
    });

    it('updates writable fields', async () => {
      const updated = await patchOk<HeroDto>(app, '/api/v1/hero/archmage', {
        name: 'Renamed',
      });
      expect(updated.name).toBe('Renamed');
    });

    it('returns 404 when the resource is not found', () =>
      http(app).patch('/api/v1/hero/nope').send({ name: 'X' }).expect(404));

    it('returns 400 when name is empty', () =>
      http(app).patch('/api/v1/hero/archmage').send({ name: '' }).expect(400));

    describe('elements', () => {
      it('accepts an elements map referencing existing Elements', () =>
        http(app)
          .patch('/api/v1/hero/archmage')
          .send({ elements: { fire: 3 } })
          .expect(200));

      it('returns 400 when any elements amount is negative', () =>
        http(app)
          .patch('/api/v1/hero/archmage')
          .send({ elements: { fire: -1 } })
          .expect(400));
    });

    describe('faction', () => {
      it('accepts zero or one faction', () =>
        http(app)
          .patch('/api/v1/hero/archmage')
          .send({ faction: 'orderOfAsh' })
          .expect(200));
    });
  });

  describe('GET /api/v1/hero/:id', () => {
    it('returns the resource by id', async () => {
      await postOk(app, '/api/v1/hero', mocker.hero.createBody());
      const found = await getOk<HeroDto>(app, '/api/v1/hero/archmage');
      expect(found.id).toBe('archmage');
    });

    it('returns 404 when the resource is not found', () =>
      http(app).get('/api/v1/hero/nope').expect(404));
  });

  describe('GET /api/v1/hero?universeId=:id', () => {
    it('returns resources for that Universe', async () => {
      await postOk(app, '/api/v1/hero', mocker.hero.createBody());
      await postOk(
        app,
        '/api/v1/hero',
        mocker.hero.createBody({ id: 'guardian' }),
      );
      const list = await getOk<HeroDto[]>(
        app,
        '/api/v1/hero?universeId=eldoria',
      );
      expect(list.map((h) => h.id).sort()).toEqual(['archmage', 'guardian']);
    });

    it('returns empty array when the Universe has no resources of this kind', async () => {
      const list = await getOk<HeroDto[]>(
        app,
        '/api/v1/hero?universeId=eldoria',
      );
      expect(list).toEqual([]);
    });

    it('returns empty array when universeId does not exist', async () => {
      const list = await getOk<HeroDto[]>(app, '/api/v1/hero?universeId=ghost');
      expect(list).toEqual([]);
    });

    it('does not return resources from other Universes', async () => {
      await seedCodex(app, 'cyberDeal');
      await postOk(app, '/api/v1/hero', mocker.hero.createBody());
      await postOk(
        app,
        '/api/v1/hero',
        mocker.hero.createBody({ id: 'cyberHero', universeId: 'cyberDeal' }),
      );
      const list = await getOk<HeroDto[]>(
        app,
        '/api/v1/hero?universeId=eldoria',
      );
      expect(list.map((h) => h.id)).toEqual(['archmage']);
    });
  });
});
