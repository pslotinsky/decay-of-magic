import { INestApplication } from '@nestjs/common';

import { StatDto } from '@dod/api-contract';

import { getOk, http, patchOk, postOk } from './helpers/http';
import { mocker } from './helpers/mocker';
import { setupApp } from './helpers/setupApp';

describe('StatGate (api)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await setupApp();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /api/v1/stat', () => {
    it('creates the resource and returns it', async () => {
      const stat = await postOk<StatDto>(
        app,
        '/api/v1/stat',
        mocker.stat.createBody(),
      );
      expect(stat.id).toBe('attack');
      expect(stat.appliesTo).toEqual(['minion']);
    });

    it('returns 400 when universeId is missing', () =>
      http(app)
        .post('/api/v1/stat')
        .send({ ...mocker.stat.createBody(), universeId: undefined })
        .expect(400));

    it('returns 400 when name is missing', () =>
      http(app)
        .post('/api/v1/stat')
        .send({ ...mocker.stat.createBody(), name: undefined })
        .expect(400));

    it('returns 400 when name is empty', () =>
      http(app)
        .post('/api/v1/stat')
        .send(mocker.stat.createBody({ name: '' }))
        .expect(400));

    it('returns 400 when name exceeds max length', () =>
      http(app)
        .post('/api/v1/stat')
        .send(mocker.stat.createBody({ name: 'a'.repeat(51) }))
        .expect(400));

    it('returns 409 when id already exists in the same Universe', async () => {
      await postOk(app, '/api/v1/stat', mocker.stat.createBody());
      await http(app)
        .post('/api/v1/stat')
        .send(mocker.stat.createBody({ name: 'Attack 2' }))
        .expect(409);
    });

    it('allows the same id in a different Universe', async () => {
      await postOk(app, '/api/v1/stat', mocker.stat.createBody());
      await postOk(
        app,
        '/api/v1/stat',
        mocker.stat.createBody({ universeId: 'cyberDeal' }),
      );
    });

    describe('appliesTo', () => {
      it('accepts appliesTo with one or more of minion | hero | card', async () => {
        const stat = await postOk<StatDto>(
          app,
          '/api/v1/stat',
          mocker.stat.createBody({
            id: 'health',
            name: 'Health',
            appliesTo: ['minion', 'hero'],
          }),
        );
        expect(stat.appliesTo).toEqual(['minion', 'hero']);
      });

      it('returns 400 when appliesTo is empty', () =>
        http(app)
          .post('/api/v1/stat')
          .send(mocker.stat.createBody({ appliesTo: [] }))
          .expect(400));

      it('returns 400 when appliesTo contains an unknown entity type', () =>
        http(app)
          .post('/api/v1/stat')
          .send(mocker.stat.createBody({ appliesTo: ['robot' as never] }))
          .expect(400));
    });
  });

  describe('PATCH /api/v1/stat/:id', () => {
    beforeEach(async () => {
      await postOk(app, '/api/v1/stat', mocker.stat.createBody());
    });

    it('updates writable fields', async () => {
      const updated = await patchOk<StatDto>(app, '/api/v1/stat/attack', {
        name: 'Renamed',
      });
      expect(updated.name).toBe('Renamed');
    });

    it('returns 404 when the resource is not found', () =>
      http(app).patch('/api/v1/stat/nope').send({ name: 'Nope' }).expect(404));

    it('returns 400 when name is empty', () =>
      http(app).patch('/api/v1/stat/attack').send({ name: '' }).expect(400));

    describe('appliesTo', () => {
      it('accepts appliesTo with one or more of minion | hero | card', async () => {
        const updated = await patchOk<StatDto>(app, '/api/v1/stat/attack', {
          appliesTo: ['hero', 'card'],
        });
        expect(updated.appliesTo).toEqual(['hero', 'card']);
      });

      it('returns 400 when appliesTo is empty', () =>
        http(app)
          .patch('/api/v1/stat/attack')
          .send({ appliesTo: [] })
          .expect(400));

      it('returns 400 when appliesTo contains an unknown entity type', () =>
        http(app)
          .patch('/api/v1/stat/attack')
          .send({ appliesTo: ['robot'] })
          .expect(400));
    });
  });

  describe('GET /api/v1/stat/:id', () => {
    it('returns the resource by id', async () => {
      await postOk(app, '/api/v1/stat', mocker.stat.createBody());
      const found = await getOk<StatDto>(app, '/api/v1/stat/attack');
      expect(found.id).toBe('attack');
    });

    it('returns 404 when the resource is not found', () =>
      http(app).get('/api/v1/stat/nope').expect(404));
  });

  describe('GET /api/v1/stat?universeId=:id', () => {
    it('returns resources for that Universe', async () => {
      await postOk(app, '/api/v1/stat', mocker.stat.createBody());
      await postOk(
        app,
        '/api/v1/stat',
        mocker.stat.createBody({ id: 'health', name: 'Health' }),
      );
      const list = await getOk<StatDto[]>(
        app,
        '/api/v1/stat?universeId=eldoria',
      );
      expect(list.map((stat) => stat.id).sort()).toEqual(['attack', 'health']);
    });

    it('returns empty array when the Universe has no resources of this kind', async () => {
      const list = await getOk<StatDto[]>(
        app,
        '/api/v1/stat?universeId=eldoria',
      );
      expect(list).toEqual([]);
    });

    it('returns empty array when universeId does not exist', async () => {
      const list = await getOk<StatDto[]>(app, '/api/v1/stat?universeId=ghost');
      expect(list).toEqual([]);
    });

    it('does not return resources from other Universes', async () => {
      await postOk(app, '/api/v1/stat', mocker.stat.createBody());
      await postOk(
        app,
        '/api/v1/stat',
        mocker.stat.createBody({ universeId: 'cyberDeal' }),
      );
      const list = await getOk<StatDto[]>(
        app,
        '/api/v1/stat?universeId=eldoria',
      );
      expect(list).toHaveLength(1);
      expect(list[0]?.universeId).toBe('eldoria');
    });
  });
});
