import { INestApplication } from '@nestjs/common';

import { ElementDto } from '@dod/api-contract';

import { getOk, http, patchOk, postOk } from '../helpers/http';
import { mocker } from '../helpers/mocker';
import { setupApp } from './setupApp';

describe('ElementGate (api)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await setupApp();
  });

  afterEach(async () => {
    await app.close();
  });

  it('creates an element and reads it back', async () => {
    const created = await postOk<ElementDto>(
      app,
      '/api/v1/element',
      mocker.element.createBody(),
    );
    expect(created.id).toBe('fire');

    const fetched = await getOk<ElementDto>(app, '/api/v1/element/fire');
    expect(fetched).toEqual(created);
  });

  it('updates an element', async () => {
    await postOk(app, '/api/v1/element', mocker.element.createBody());
    const updated = await patchOk<ElementDto>(app, '/api/v1/element/fire', {
      name: 'Inferno',
    });
    expect(updated.name).toBe('Inferno');
  });

  it('rejects duplicate id within the same Universe', async () => {
    await postOk(app, '/api/v1/element', mocker.element.createBody());
    await http(app)
      .post('/api/v1/element')
      .send(mocker.element.createBody({ name: 'Flame' }))
      .expect(409);
  });

  it('allows the same id across different Universes', async () => {
    await postOk(app, '/api/v1/element', mocker.element.createBody());
    await postOk(
      app,
      '/api/v1/element',
      mocker.element.createBody({ universeId: 'cyberDeal', name: 'Heat' }),
    );
  });

  it('lists only elements from the requested Universe', async () => {
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

  it('returns 404 for unknown id', () =>
    http(app).get('/api/v1/element/nope').expect(404));
});
