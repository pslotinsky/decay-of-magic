import { INestApplication } from '@nestjs/common';

import { CardDto } from '@dod/api-contract';

import { getOk, http, patchOk, postOk } from './helpers/http';
import { mocker } from './helpers/mocker';
import { seedCodex } from './helpers/seed';
import { setupApp } from './helpers/setupApp';

describe('CardGate (api)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await setupApp();
    await seedCodex(app);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /api/v1/card', () => {
    it('creates the resource and returns it', async () => {
      const card = await postOk<CardDto>(
        app,
        '/api/v1/card',
        mocker.card.createSummonBody(),
      );
      expect(card.id).toBe('goblinBerserker');
      expect(card.activation).toBe('emptySlot');
    });

    it('returns 400 when universeId is missing', () =>
      http(app)
        .post('/api/v1/card')
        .send({ ...mocker.card.createSummonBody(), universeId: undefined })
        .expect(400));

    it('returns 400 when name is missing', () =>
      http(app)
        .post('/api/v1/card')
        .send({ ...mocker.card.createSummonBody(), name: undefined })
        .expect(400));

    it('returns 400 when name is empty', () =>
      http(app)
        .post('/api/v1/card')
        .send({ ...mocker.card.createSummonBody(), name: '' })
        .expect(400));

    it('returns 400 when name exceeds max length', () =>
      http(app)
        .post('/api/v1/card')
        .send({ ...mocker.card.createSummonBody(), name: 'a'.repeat(101) })
        .expect(400));

    it('returns 409 when id already exists in the same Universe', async () => {
      await postOk(app, '/api/v1/card', mocker.card.createSummonBody());
      await http(app)
        .post('/api/v1/card')
        .send(mocker.card.createSummonBody())
        .expect(409);
    });

    it('allows the same id in a different Universe', async () => {
      await seedCodex(app, 'cyberDeal');
      await postOk(app, '/api/v1/card', mocker.card.createSummonBody());
      await postOk(
        app,
        '/api/v1/card',
        mocker.card.createSummonBody({ universeId: 'cyberDeal' }),
      );
    });

    describe('references', () => {
      it('accepts a cost referencing existing Elements of this Universe', async () => {
        await postOk(
          app,
          '/api/v1/card',
          mocker.card.createSummonBody({ cost: { fire: 2, water: 1 } }),
        );
      });

      it('returns 400 when any cost amount is zero or negative', () =>
        http(app)
          .post('/api/v1/card')
          .send(mocker.card.createSummonBody({ cost: { fire: 0 } }))
          .expect(400));

      it('accepts factions referencing existing Factions of this Universe', async () => {
        await postOk(
          app,
          '/api/v1/card',
          mocker.card.createSummonBody({ factions: ['orderOfAsh'] }),
        );
      });
    });

    describe('activation/stats coupling', () => {
      it('requires stats when activation is emptySlot', () =>
        http(app)
          .post('/api/v1/card')
          .send({
            id: 'broken',
            universeId: 'eldoria',
            name: 'Broken',
            cost: { fire: 1 },
            activation: 'emptySlot',
          })
          .expect(400));

      it('returns 400 when stats is present and activation is anything other than emptySlot', () =>
        http(app)
          .post('/api/v1/card')
          .send({
            id: 'broken',
            universeId: 'eldoria',
            name: 'Broken',
            cost: { fire: 1 },
            activation: 'immediate',
            stats: { attack: 1, health: 1 },
          })
          .expect(400));
    });

    describe('abilities — shape', () => {
      it('accepts an Ability with one or more Effects', async () => {
        await postOk(
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
      });

      it('returns 400 when an Ability has an empty effects array', () =>
        http(app)
          .post('/api/v1/card')
          .send(
            mocker.card.createSummonBody({
              abilities: [{ trigger: 'onPlay', target: 'self', effects: [] }],
            }),
          )
          .expect(400));

      it('returns 400 when an Ability has neither trigger nor passive: true', () =>
        http(app)
          .post('/api/v1/card')
          .send(
            mocker.card.createSummonBody({
              abilities: [
                {
                  target: 'self',
                  effects: [{ kind: 'damage', params: { amount: 1 } }],
                } as never,
              ],
            }),
          )
          .expect(400));

      it('returns 400 when an Ability has both trigger and passive: true', () =>
        http(app)
          .post('/api/v1/card')
          .send(
            mocker.card.createSummonBody({
              abilities: [
                {
                  trigger: 'onPlay',
                  passive: true,
                  target: 'self',
                  effects: [{ kind: 'damage', params: { amount: 1 } }],
                } as never,
              ],
            }),
          )
          .expect(400));

      it("returns 400 when an Ability's trigger is not a known Trigger value", () =>
        http(app)
          .post('/api/v1/card')
          .send(
            mocker.card.createSummonBody({
              abilities: [
                {
                  trigger: 'onMystery' as never,
                  target: 'self',
                  effects: [{ kind: 'damage', params: { amount: 1 } }],
                },
              ],
            }),
          )
          .expect(400));

      it("returns 400 when an Ability's target is not a known Target slug", () =>
        http(app)
          .post('/api/v1/card')
          .send(
            mocker.card.createSummonBody({
              abilities: [
                {
                  trigger: 'onPlay',
                  target: 'mysterious' as never,
                  effects: [{ kind: 'damage', params: { amount: 1 } }],
                },
              ],
            }),
          )
          .expect(400));
    });

    describe('effects', () => {
      it("returns 400 when an Effect's kind is not a registered effect", () =>
        http(app)
          .post('/api/v1/card')
          .send(
            mocker.card.createSummonBody({
              abilities: [
                {
                  trigger: 'onPlay',
                  target: 'self',
                  effects: [
                    { kind: 'mysteryKind' as never, params: { amount: 1 } },
                  ],
                },
              ],
            }),
          )
          .expect(400));

      it("returns 400 when an Effect's params violate the kind's declared schema", () =>
        http(app)
          .post('/api/v1/card')
          .send(
            mocker.card.createSummonBody({
              abilities: [
                {
                  trigger: 'onPlay',
                  target: 'self',
                  effects: [{ kind: 'damage', params: {} as never }],
                },
              ],
            }),
          )
          .expect(400));
    });

    describe('expressions', () => {
      it('returns 400 when a structured operator uses an unknown key', () =>
        http(app)
          .post('/api/v1/card')
          .send(
            mocker.card.createSummonBody({
              abilities: [
                {
                  trigger: 'onPlay',
                  target: 'self',
                  effects: [
                    {
                      kind: 'damage',
                      params: { amount: { foo: [1, 2] } as never },
                    },
                  ],
                },
              ],
            }),
          )
          .expect(400));

      it("returns 400 when a structured operator's operand count violates the operator's arity", () =>
        http(app)
          .post('/api/v1/card')
          .send(
            mocker.card.createSummonBody({
              abilities: [
                {
                  trigger: 'onPlay',
                  target: 'self',
                  effects: [
                    {
                      kind: 'damage',
                      params: { amount: { eq: [1] } as never },
                    },
                  ],
                },
              ],
            }),
          )
          .expect(400));
    });
  });

  describe('PATCH /api/v1/card/:id', () => {
    beforeEach(async () => {
      await postOk(app, '/api/v1/card', mocker.card.createSummonBody());
    });

    it('updates writable fields', async () => {
      const updated = await patchOk<CardDto>(
        app,
        '/api/v1/card/goblinBerserker',
        { name: 'Greater Goblin' },
      );
      expect(updated.name).toBe('Greater Goblin');
    });

    it('returns 404 when the resource is not found', () =>
      http(app).patch('/api/v1/card/nope').send({ name: 'Nope' }).expect(404));

    it('returns 400 when name is empty', () =>
      http(app)
        .patch('/api/v1/card/goblinBerserker')
        .send({ name: '' })
        .expect(400));

    describe('references', () => {
      it('accepts a cost referencing existing Elements of this Universe', () =>
        http(app)
          .patch('/api/v1/card/goblinBerserker')
          .send({ cost: { fire: 2, water: 1 } })
          .expect(200));

      it('returns 400 when any cost amount is zero or negative', () =>
        http(app)
          .patch('/api/v1/card/goblinBerserker')
          .send({ cost: { fire: 0 } })
          .expect(400));

      it('accepts factions referencing existing Factions of this Universe', () =>
        http(app)
          .patch('/api/v1/card/goblinBerserker')
          .send({ factions: ['orderOfAsh'] })
          .expect(200));
    });

    describe('abilities — shape', () => {
      it('accepts an Ability with one or more Effects', () =>
        http(app)
          .patch('/api/v1/card/goblinBerserker')
          .send({
            abilities: [
              {
                trigger: 'onPlay',
                target: 'self',
                effects: [{ kind: 'damage', params: { amount: 1 } }],
              },
            ],
          })
          .expect(200));

      it('returns 400 when an Ability has an empty effects array', () =>
        http(app)
          .patch('/api/v1/card/goblinBerserker')
          .send({
            abilities: [{ trigger: 'onPlay', target: 'self', effects: [] }],
          })
          .expect(400));

      it('returns 400 when an Ability has neither trigger nor passive: true', () =>
        http(app)
          .patch('/api/v1/card/goblinBerserker')
          .send({
            abilities: [
              {
                target: 'self',
                effects: [{ kind: 'damage', params: { amount: 1 } }],
              },
            ],
          })
          .expect(400));

      it('returns 400 when an Ability has both trigger and passive: true', () =>
        http(app)
          .patch('/api/v1/card/goblinBerserker')
          .send({
            abilities: [
              {
                trigger: 'onPlay',
                passive: true,
                target: 'self',
                effects: [{ kind: 'damage', params: { amount: 1 } }],
              },
            ],
          })
          .expect(400));

      it("returns 400 when an Ability's trigger is not a known Trigger value", () =>
        http(app)
          .patch('/api/v1/card/goblinBerserker')
          .send({
            abilities: [
              {
                trigger: 'onMystery',
                target: 'self',
                effects: [{ kind: 'damage', params: { amount: 1 } }],
              },
            ],
          })
          .expect(400));

      it("returns 400 when an Ability's target is not a known Target slug", () =>
        http(app)
          .patch('/api/v1/card/goblinBerserker')
          .send({
            abilities: [
              {
                trigger: 'onPlay',
                target: 'mysterious',
                effects: [{ kind: 'damage', params: { amount: 1 } }],
              },
            ],
          })
          .expect(400));
    });

    describe('effects', () => {
      it("returns 400 when an Effect's kind is not a registered effect", () =>
        http(app)
          .patch('/api/v1/card/goblinBerserker')
          .send({
            abilities: [
              {
                trigger: 'onPlay',
                target: 'self',
                effects: [{ kind: 'mysteryKind', params: { amount: 1 } }],
              },
            ],
          })
          .expect(400));

      it("returns 400 when an Effect's params violate the kind's declared schema", () =>
        http(app)
          .patch('/api/v1/card/goblinBerserker')
          .send({
            abilities: [
              {
                trigger: 'onPlay',
                target: 'self',
                effects: [{ kind: 'damage', params: {} }],
              },
            ],
          })
          .expect(400));
    });

    describe('expressions', () => {
      it('returns 400 when a structured operator uses an unknown key', () =>
        http(app)
          .patch('/api/v1/card/goblinBerserker')
          .send({
            abilities: [
              {
                trigger: 'onPlay',
                target: 'self',
                effects: [
                  { kind: 'damage', params: { amount: { foo: [1, 2] } } },
                ],
              },
            ],
          })
          .expect(400));

      it("returns 400 when a structured operator's operand count violates the operator's arity", () =>
        http(app)
          .patch('/api/v1/card/goblinBerserker')
          .send({
            abilities: [
              {
                trigger: 'onPlay',
                target: 'self',
                effects: [{ kind: 'damage', params: { amount: { eq: [1] } } }],
              },
            ],
          })
          .expect(400));
    });
  });

  describe('GET /api/v1/card/:id', () => {
    it('returns the resource by id', async () => {
      await postOk(app, '/api/v1/card', mocker.card.createSummonBody());
      const found = await getOk<CardDto>(app, '/api/v1/card/goblinBerserker');
      expect(found.id).toBe('goblinBerserker');
    });

    it('returns 404 when the resource is not found', () =>
      http(app).get('/api/v1/card/nope').expect(404));
  });

  describe('GET /api/v1/card?universeId=:id', () => {
    it('returns resources for that Universe', async () => {
      await postOk(app, '/api/v1/card', mocker.card.createSummonBody());
      await postOk(app, '/api/v1/card', mocker.card.createSpellBody());
      const list = await getOk<CardDto[]>(
        app,
        '/api/v1/card?universeId=eldoria',
      );
      expect(list.map((card) => card.id).sort()).toEqual([
        'fireball',
        'goblinBerserker',
      ]);
    });

    it('returns empty array when the Universe has no resources of this kind', async () => {
      const list = await getOk<CardDto[]>(
        app,
        '/api/v1/card?universeId=eldoria',
      );
      expect(list).toEqual([]);
    });

    it('returns empty array when universeId does not exist', async () => {
      const list = await getOk<CardDto[]>(app, '/api/v1/card?universeId=ghost');
      expect(list).toEqual([]);
    });

    it('does not return resources from other Universes', async () => {
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
      const list = await getOk<CardDto[]>(
        app,
        '/api/v1/card?universeId=eldoria',
      );
      expect(list.map((card) => card.id)).toEqual(['goblinBerserker']);
    });
  });
});
