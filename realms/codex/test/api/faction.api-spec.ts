import { INestApplication } from '@nestjs/common';

import { FactionDto } from '@dod/api-contract';

import { getOk, http, patchOk, postOk } from './helpers/http';
import { mocker } from './helpers/mocker';
import { setupApp } from './helpers/setupApp';

describe('FactionGate (api)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await setupApp();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /api/v1/faction', () => {
    it('creates the resource and returns it', async () => {
      const faction = await postOk<FactionDto>(
        app,
        '/api/v1/faction',
        mocker.faction.createBody(),
      );
      expect(faction.id).toBe('orderOfAsh');
      expect(faction.universeId).toBe('eldoria');
      expect(faction.name).toBe('Order of Ash');
    });

    it('returns 400 when universeId is missing', () =>
      http(app)
        .post('/api/v1/faction')
        .send({ ...mocker.faction.createBody(), universeId: undefined })
        .expect(400));

    it('returns 400 when name is missing', () =>
      http(app)
        .post('/api/v1/faction')
        .send({ ...mocker.faction.createBody(), name: undefined })
        .expect(400));

    it('returns 400 when name is empty', () =>
      http(app)
        .post('/api/v1/faction')
        .send(mocker.faction.createBody({ name: '' }))
        .expect(400));

    it('returns 400 when name exceeds max length', () =>
      http(app)
        .post('/api/v1/faction')
        .send(mocker.faction.createBody({ name: 'a'.repeat(51) }))
        .expect(400));

    it('returns 409 when id already exists in the same Universe', async () => {
      await postOk(app, '/api/v1/faction', mocker.faction.createBody());
      await http(app)
        .post('/api/v1/faction')
        .send(mocker.faction.createBody({ name: 'Other Order' }))
        .expect(409);
    });

    it('allows the same id in a different Universe', async () => {
      await postOk(app, '/api/v1/faction', mocker.faction.createBody());
      await postOk(
        app,
        '/api/v1/faction',
        mocker.faction.createBody({ universeId: 'cyberDeal', name: 'Order' }),
      );
    });
  });

  describe('PATCH /api/v1/faction/:id', () => {
    it('updates writable fields', async () => {
      await postOk(app, '/api/v1/faction', mocker.faction.createBody());
      const updated = await patchOk<FactionDto>(
        app,
        '/api/v1/faction/orderOfAsh',
        { name: 'Renamed' },
      );
      expect(updated.name).toBe('Renamed');
    });

    it('returns 404 when the resource is not found', () =>
      http(app)
        .patch('/api/v1/faction/nope')
        .send({ name: 'Nope' })
        .expect(404));

    it('returns 400 when name is empty', () =>
      http(app)
        .patch('/api/v1/faction/orderOfAsh')
        .send({ name: '' })
        .expect(400));
  });

  describe('GET /api/v1/faction/:id', () => {
    it('returns the resource by id', async () => {
      await postOk(app, '/api/v1/faction', mocker.faction.createBody());
      const found = await getOk<FactionDto>(app, '/api/v1/faction/orderOfAsh');
      expect(found.id).toBe('orderOfAsh');
    });

    it('returns 404 when the resource is not found', () =>
      http(app).get('/api/v1/faction/nope').expect(404));
  });

  describe('GET /api/v1/faction?universeId=:id', () => {
    it('returns resources for that Universe', async () => {
      await postOk(app, '/api/v1/faction', mocker.faction.createBody());
      await postOk(
        app,
        '/api/v1/faction',
        mocker.faction.createBody({
          id: 'circleOfDecay',
          name: 'Circle of Decay',
        }),
      );
      const list = await getOk<FactionDto[]>(
        app,
        '/api/v1/faction?universeId=eldoria',
      );
      expect(list.map((faction) => faction.id).sort()).toEqual([
        'circleOfDecay',
        'orderOfAsh',
      ]);
    });

    it('returns empty array when the Universe has no resources of this kind', async () => {
      const list = await getOk<FactionDto[]>(
        app,
        '/api/v1/faction?universeId=eldoria',
      );
      expect(list).toEqual([]);
    });

    it('returns empty array when universeId does not exist', async () => {
      const list = await getOk<FactionDto[]>(
        app,
        '/api/v1/faction?universeId=ghost',
      );
      expect(list).toEqual([]);
    });

    it('does not return resources from other Universes', async () => {
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
  });
});
