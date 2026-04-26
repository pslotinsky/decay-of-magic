import { INestApplication } from '@nestjs/common';

import { TraitDto } from '@dod/api-contract';

import { getOk, http, patchOk, postOk } from './helpers/http';
import { mocker } from './helpers/mocker';
import { setupApp } from './helpers/setupApp';

describe('TraitGate (api)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await setupApp();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /api/v1/trait', () => {
    it('creates the resource and returns it', async () => {
      const trait = await postOk<TraitDto>(
        app,
        '/api/v1/trait',
        mocker.trait.createBody(),
      );
      expect(trait.id).toBe('wall');
      expect(trait.appliesTo).toEqual(['minion']);
    });

    it('returns 400 when universeId is missing', () =>
      http(app)
        .post('/api/v1/trait')
        .send({ ...mocker.trait.createBody(), universeId: undefined })
        .expect(400));

    it('returns 400 when name is missing', () =>
      http(app)
        .post('/api/v1/trait')
        .send({ ...mocker.trait.createBody(), name: undefined })
        .expect(400));

    it('returns 400 when name is empty', () =>
      http(app)
        .post('/api/v1/trait')
        .send(mocker.trait.createBody({ name: '' }))
        .expect(400));

    it('returns 400 when name exceeds max length', () =>
      http(app)
        .post('/api/v1/trait')
        .send(mocker.trait.createBody({ name: 'a'.repeat(51) }))
        .expect(400));

    it('returns 409 when id already exists in the same Universe', async () => {
      await postOk(app, '/api/v1/trait', mocker.trait.createBody());
      await http(app)
        .post('/api/v1/trait')
        .send(mocker.trait.createBody({ name: 'Wall 2' }))
        .expect(409);
    });

    it('allows the same id in a different Universe', async () => {
      await postOk(app, '/api/v1/trait', mocker.trait.createBody());
      await postOk(
        app,
        '/api/v1/trait',
        mocker.trait.createBody({ universeId: 'cyberDeal' }),
      );
    });

    describe('appliesTo', () => {
      it('accepts appliesTo with one or more of minion | hero | card', async () => {
        const trait = await postOk<TraitDto>(
          app,
          '/api/v1/trait',
          mocker.trait.createBody({
            id: 'spell',
            name: 'Spell',
            appliesTo: ['card'],
          }),
        );
        expect(trait.appliesTo).toEqual(['card']);
      });

      it('returns 400 when appliesTo is empty', () =>
        http(app)
          .post('/api/v1/trait')
          .send(mocker.trait.createBody({ appliesTo: [] }))
          .expect(400));

      it('returns 400 when appliesTo contains an unknown entity type', () =>
        http(app)
          .post('/api/v1/trait')
          .send(mocker.trait.createBody({ appliesTo: ['robot' as never] }))
          .expect(400));
    });
  });

  describe('PATCH /api/v1/trait/:id', () => {
    beforeEach(async () => {
      await postOk(app, '/api/v1/trait', mocker.trait.createBody());
    });

    it('updates writable fields', async () => {
      const updated = await patchOk<TraitDto>(app, '/api/v1/trait/wall', {
        name: 'Bulwark',
      });
      expect(updated.name).toBe('Bulwark');
    });

    it('returns 404 when the resource is not found', () =>
      http(app).patch('/api/v1/trait/nope').send({ name: 'Nope' }).expect(404));

    it('returns 400 when name is empty', () =>
      http(app).patch('/api/v1/trait/wall').send({ name: '' }).expect(400));

    describe('appliesTo', () => {
      it('accepts appliesTo with one or more of minion | hero | card', async () => {
        const updated = await patchOk<TraitDto>(app, '/api/v1/trait/wall', {
          appliesTo: ['hero', 'card'],
        });
        expect(updated.appliesTo).toEqual(['hero', 'card']);
      });

      it('returns 400 when appliesTo is empty', () =>
        http(app)
          .patch('/api/v1/trait/wall')
          .send({ appliesTo: [] })
          .expect(400));

      it('returns 400 when appliesTo contains an unknown entity type', () =>
        http(app)
          .patch('/api/v1/trait/wall')
          .send({ appliesTo: ['robot'] })
          .expect(400));
    });
  });

  describe('GET /api/v1/trait/:id', () => {
    it('returns the resource by id', async () => {
      await postOk(app, '/api/v1/trait', mocker.trait.createBody());
      const found = await getOk<TraitDto>(app, '/api/v1/trait/wall');
      expect(found.id).toBe('wall');
    });

    it('returns 404 when the resource is not found', () =>
      http(app).get('/api/v1/trait/nope').expect(404));
  });

  describe('GET /api/v1/trait?universeId=:id', () => {
    it('returns resources for that Universe', async () => {
      await postOk(app, '/api/v1/trait', mocker.trait.createBody());
      await postOk(
        app,
        '/api/v1/trait',
        mocker.trait.createBody({ id: 'charge', name: 'Charge' }),
      );
      const list = await getOk<TraitDto[]>(
        app,
        '/api/v1/trait?universeId=eldoria',
      );
      expect(list.map((trait) => trait.id).sort()).toEqual(['charge', 'wall']);
    });

    it('returns empty array when the Universe has no resources of this kind', async () => {
      const list = await getOk<TraitDto[]>(
        app,
        '/api/v1/trait?universeId=eldoria',
      );
      expect(list).toEqual([]);
    });

    it('returns empty array when universeId does not exist', async () => {
      const list = await getOk<TraitDto[]>(
        app,
        '/api/v1/trait?universeId=ghost',
      );
      expect(list).toEqual([]);
    });

    it('does not return resources from other Universes', async () => {
      await postOk(app, '/api/v1/trait', mocker.trait.createBody());
      await postOk(
        app,
        '/api/v1/trait',
        mocker.trait.createBody({ universeId: 'cyberDeal' }),
      );
      const list = await getOk<TraitDto[]>(
        app,
        '/api/v1/trait?universeId=eldoria',
      );
      expect(list).toHaveLength(1);
      expect(list[0]?.universeId).toBe('eldoria');
    });
  });
});
