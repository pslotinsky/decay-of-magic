import { INestApplication } from '@nestjs/common';

import { TraitDto } from '@dod/api-contract';

import { getOk, http, patchOk, postOk } from '../helpers/http';
import { mocker } from '../helpers/mocker';
import { setupApp } from './setupApp';

describe('TraitGate (api)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await setupApp();
  });

  afterEach(async () => {
    await app.close();
  });

  it('creates a trait and reads it back, preserving appliesTo', async () => {
    const created = await postOk<TraitDto>(
      app,
      '/api/v1/trait',
      mocker.trait.createBody({ appliesTo: ['minion', 'hero'] }),
    );
    expect(created.appliesTo).toEqual(['minion', 'hero']);

    const fetched = await getOk<TraitDto>(app, '/api/v1/trait/wall');
    expect(fetched.appliesTo).toEqual(['minion', 'hero']);
  });

  it('updates a trait', async () => {
    await postOk(app, '/api/v1/trait', mocker.trait.createBody());
    const updated = await patchOk<TraitDto>(app, '/api/v1/trait/wall', {
      name: 'Bulwark',
      appliesTo: ['hero', 'card'],
    });
    expect(updated.name).toBe('Bulwark');
    expect(updated.appliesTo).toEqual(['hero', 'card']);
  });

  it('rejects duplicate id within the same Universe', async () => {
    await postOk(app, '/api/v1/trait', mocker.trait.createBody());
    await http(app)
      .post('/api/v1/trait')
      .send(mocker.trait.createBody({ name: 'Wall 2' }))
      .expect(409);
  });

  it('allows the same id across different Universes', async () => {
    await postOk(app, '/api/v1/trait', mocker.trait.createBody());
    await postOk(
      app,
      '/api/v1/trait',
      mocker.trait.createBody({ universeId: 'cyberDeal' }),
    );
  });

  it('lists only traits from the requested Universe', async () => {
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

  it('returns 404 for unknown id', () =>
    http(app).get('/api/v1/trait/nope').expect(404));
});
