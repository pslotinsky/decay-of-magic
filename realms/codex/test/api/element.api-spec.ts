import { INestApplication } from '@nestjs/common';

import { ElementDto } from '@dod/api-contract';

import { getOk, http, patchOk, postOk } from './helpers/http';
import { mocker } from './helpers/mocker';
import { setupApp } from './helpers/setupApp';

describe('ElementGate (api)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await setupApp();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /api/v1/element', () => {
    it('creates the resource and returns it', async () => {
      const element = await postOk<ElementDto>(
        app,
        '/api/v1/element',
        mocker.element.createBody(),
      );
      expect(element.id).toBe('fire');
      expect(element.universeId).toBe('eldoria');
      expect(element.name).toBe('Fire');
    });

    it('returns 400 when universeId is missing', () =>
      http(app)
        .post('/api/v1/element')
        .send({ ...mocker.element.createBody(), universeId: undefined })
        .expect(400));

    it('returns 400 when name is missing', () =>
      http(app)
        .post('/api/v1/element')
        .send({ ...mocker.element.createBody(), name: undefined })
        .expect(400));

    it('returns 400 when name is empty', () =>
      http(app)
        .post('/api/v1/element')
        .send(mocker.element.createBody({ name: '' }))
        .expect(400));

    it('returns 400 when name exceeds max length', () =>
      http(app)
        .post('/api/v1/element')
        .send(mocker.element.createBody({ name: 'a'.repeat(51) }))
        .expect(400));

    it('returns 409 when id already exists in the same Universe', async () => {
      await postOk(app, '/api/v1/element', mocker.element.createBody());
      await http(app)
        .post('/api/v1/element')
        .send(mocker.element.createBody({ name: 'Flame' }))
        .expect(409);
    });

    it('allows the same id in a different Universe', async () => {
      await postOk(app, '/api/v1/element', mocker.element.createBody());
      await postOk(
        app,
        '/api/v1/element',
        mocker.element.createBody({ universeId: 'cyberDeal', name: 'Heat' }),
      );
    });
  });

  describe('PATCH /api/v1/element/:id', () => {
    it('updates writable fields', async () => {
      await postOk(app, '/api/v1/element', mocker.element.createBody());
      const updated = await patchOk<ElementDto>(app, '/api/v1/element/fire', {
        name: 'Inferno',
      });
      expect(updated.name).toBe('Inferno');
    });

    it('returns 404 when the resource is not found', () =>
      http(app)
        .patch('/api/v1/element/nope')
        .send({ name: 'Nope' })
        .expect(404));

    it('returns 400 when name is empty', () =>
      http(app).patch('/api/v1/element/fire').send({ name: '' }).expect(400));
  });

  describe('GET /api/v1/element/:id', () => {
    it('returns the resource by id', async () => {
      await postOk(app, '/api/v1/element', mocker.element.createBody());
      const found = await getOk<ElementDto>(app, '/api/v1/element/fire');
      expect(found.id).toBe('fire');
      expect(found.name).toBe('Fire');
    });

    it('returns 404 when the resource is not found', () =>
      http(app).get('/api/v1/element/nope').expect(404));
  });

  describe('GET /api/v1/element?universeId=:id', () => {
    it('returns resources for that Universe', async () => {
      await postOk(app, '/api/v1/element', mocker.element.createBody());
      await postOk(
        app,
        '/api/v1/element',
        mocker.element.createBody({ id: 'water', name: 'Water' }),
      );
      const list = await getOk<ElementDto[]>(
        app,
        '/api/v1/element?universeId=eldoria',
      );
      expect(list.map((element) => element.id).sort()).toEqual([
        'fire',
        'water',
      ]);
    });

    it('returns empty array when the Universe has no resources of this kind', async () => {
      const list = await getOk<ElementDto[]>(
        app,
        '/api/v1/element?universeId=eldoria',
      );
      expect(list).toEqual([]);
    });

    it('returns empty array when universeId does not exist', async () => {
      const list = await getOk<ElementDto[]>(
        app,
        '/api/v1/element?universeId=ghost',
      );
      expect(list).toEqual([]);
    });

    it('does not return resources from other Universes', async () => {
      await postOk(app, '/api/v1/element', mocker.element.createBody());
      await postOk(
        app,
        '/api/v1/element',
        mocker.element.createBody({
          id: 'credits',
          universeId: 'cyberDeal',
          name: 'Credits',
        }),
      );
      const list = await getOk<ElementDto[]>(
        app,
        '/api/v1/element?universeId=eldoria',
      );
      expect(list.map((element) => element.id)).toEqual(['fire']);
    });
  });
});
