import { INestApplication } from '@nestjs/common';

import { CardDto } from '@dod/api-contract';

import { getOk, http, patchOk, postOk } from '../helpers/http';
import { mocker } from '../helpers/mocker';
import { seedCodex } from '../helpers/seed';
import { setupApp } from './setupApp';

describe('CardGate (api)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await setupApp();
    await seedCodex(app);
  });

  afterEach(async () => {
    await app.close();
  });

  it('creates a summon card and reads it back with abilities', async () => {
    const created = await postOk<CardDto>(
      app,
      '/api/v1/card',
      mocker.card.createSummonBody({
        abilities: [
          {
            trigger: 'onPlay',
            target: 'self',
            effects: [{ kind: 'damage', params: { amount: 1 } }],
          },
        ],
      }),
    );
    expect(created.id).toBe('goblinBerserker');

    const fetched = await getOk<CardDto>(app, '/api/v1/card/goblinBerserker');
    expect(fetched).toEqual(created);
  });

  it('updates a card', async () => {
    await postOk(app, '/api/v1/card', mocker.card.createSummonBody());
    const updated = await patchOk<CardDto>(
      app,
      '/api/v1/card/goblinBerserker',
      { name: 'Greater Goblin' },
    );
    expect(updated.name).toBe('Greater Goblin');
  });

  it('rejects duplicate id within the same Universe', async () => {
    await postOk(app, '/api/v1/card', mocker.card.createSummonBody());
    await http(app)
      .post('/api/v1/card')
      .send(mocker.card.createSummonBody())
      .expect(409);
  });

  it('allows the same id across different Universes', async () => {
    await seedCodex(app, 'cyberDeal');
    await postOk(app, '/api/v1/card', mocker.card.createSummonBody());
    await postOk(
      app,
      '/api/v1/card',
      mocker.card.createSummonBody({ universeId: 'cyberDeal' }),
    );
  });

  it('lists only cards from the requested Universe', async () => {
    await seedCodex(app, 'cyberDeal');
    await postOk(app, '/api/v1/card', mocker.card.createSummonBody());
    await postOk(
      app,
      '/api/v1/card',
      mocker.card.createSummonBody({
        id: 'cyberMinion',
        universeId: 'cyberDeal',
      }),
    );
    const list = await getOk<CardDto[]>(app, '/api/v1/card?universeId=eldoria');
    expect(list.map((card) => card.id)).toEqual(['goblinBerserker']);
  });

  it('returns 404 for unknown id', () =>
    http(app).get('/api/v1/card/nope').expect(404));
});
