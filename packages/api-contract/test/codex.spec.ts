import { z } from 'zod';

import {
  CreateCardSchema,
  CreateElementSchema,
  CreateFactionSchema,
  CreateHeroSchema,
  CreateStatSchema,
  CreateTraitSchema,
  UpdateCardSchema,
  UpdateElementSchema,
  UpdateHeroSchema,
  UpdateStatSchema,
  UpdateTraitSchema,
} from '../src/contracts/codex';

const accepts = (schema: z.ZodType, input: unknown): void => {
  const result = schema.safeParse(input);
  if (!result.success) {
    throw new Error(`expected valid, got: ${JSON.stringify(result.error.issues)}`);
  }
};

const rejects = (schema: z.ZodType, input: unknown): void => {
  expect(schema.safeParse(input).success).toBe(false);
};

const validElement = () => ({
  id: 'fire',
  universeId: 'eldoria',
  name: 'Fire',
});

const validStat = () => ({
  id: 'attack',
  universeId: 'eldoria',
  name: 'Attack',
  appliesTo: ['minion'] as const,
});

const validTrait = () => ({
  id: 'wall',
  universeId: 'eldoria',
  name: 'Wall',
  appliesTo: ['minion'] as const,
});

const validSummonCard = () => ({
  id: 'goblin',
  universeId: 'eldoria',
  name: 'Goblin',
  cost: { fire: 1 },
  stats: { attack: 4, health: 16 },
  activation: 'emptySlot' as const,
});

const validSpellCard = () => ({
  id: 'fireball',
  universeId: 'eldoria',
  name: 'Fireball',
  cost: { fire: 5 },
  activation: 'immediate' as const,
});

const validHero = () => ({
  id: 'archmage',
  universeId: 'eldoria',
  name: 'Archmage',
  elements: { fire: 5, water: 5 },
});

describe('CreateElementSchema', () => {
  it('accepts a valid element', () => accepts(CreateElementSchema, validElement()));
  it('rejects missing universeId', () =>
    rejects(CreateElementSchema, { ...validElement(), universeId: undefined }));
  it('rejects missing name', () =>
    rejects(CreateElementSchema, { ...validElement(), name: undefined }));
  it('rejects empty name', () =>
    rejects(CreateElementSchema, { ...validElement(), name: '' }));
  it('rejects name above 50 chars', () =>
    rejects(CreateElementSchema, { ...validElement(), name: 'a'.repeat(51) }));
  it('rejects non-camelCase id', () =>
    rejects(CreateElementSchema, { ...validElement(), id: 'Fire' }));
});

describe('UpdateElementSchema', () => {
  it('accepts a name change', () => accepts(UpdateElementSchema, { name: 'Inferno' }));
  it('accepts an empty patch', () => accepts(UpdateElementSchema, {}));
  it('rejects empty name', () => rejects(UpdateElementSchema, { name: '' }));
});

describe('CreateFactionSchema', () => {
  const valid = () => ({ id: 'orderOfAsh', universeId: 'eldoria', name: 'Order of Ash' });
  it('accepts a valid faction', () => accepts(CreateFactionSchema, valid()));
  it('rejects missing universeId', () =>
    rejects(CreateFactionSchema, { ...valid(), universeId: undefined }));
  it('rejects empty name', () =>
    rejects(CreateFactionSchema, { ...valid(), name: '' }));
  it('rejects name above 50 chars', () =>
    rejects(CreateFactionSchema, { ...valid(), name: 'a'.repeat(51) }));
});

describe('CreateStatSchema', () => {
  it('accepts a valid stat', () => accepts(CreateStatSchema, validStat()));
  it('accepts multiple appliesTo values', () =>
    accepts(CreateStatSchema, { ...validStat(), appliesTo: ['minion', 'hero', 'card'] }));
  it('rejects missing universeId', () =>
    rejects(CreateStatSchema, { ...validStat(), universeId: undefined }));
  it('rejects empty name', () =>
    rejects(CreateStatSchema, { ...validStat(), name: '' }));
  it('rejects name above 50 chars', () =>
    rejects(CreateStatSchema, { ...validStat(), name: 'a'.repeat(51) }));
  it('rejects empty appliesTo', () =>
    rejects(CreateStatSchema, { ...validStat(), appliesTo: [] }));
  it('rejects unknown appliesTo value', () =>
    rejects(CreateStatSchema, { ...validStat(), appliesTo: ['robot'] }));
});

describe('UpdateStatSchema', () => {
  it('accepts an empty patch', () => accepts(UpdateStatSchema, {}));
  it('accepts a partial change', () => accepts(UpdateStatSchema, { name: 'Renamed' }));
  it('accepts an appliesTo update', () =>
    accepts(UpdateStatSchema, { appliesTo: ['hero', 'card'] }));
  it('rejects empty name', () => rejects(UpdateStatSchema, { name: '' }));
  it('rejects empty appliesTo', () => rejects(UpdateStatSchema, { appliesTo: [] }));
  it('rejects unknown appliesTo value', () =>
    rejects(UpdateStatSchema, { appliesTo: ['robot'] }));
});

describe('CreateTraitSchema', () => {
  it('accepts a valid trait', () => accepts(CreateTraitSchema, validTrait()));
  it('accepts multiple appliesTo values', () =>
    accepts(CreateTraitSchema, { ...validTrait(), appliesTo: ['minion', 'hero', 'card'] }));
  it('rejects empty appliesTo', () =>
    rejects(CreateTraitSchema, { ...validTrait(), appliesTo: [] }));
  it('rejects unknown appliesTo value', () =>
    rejects(CreateTraitSchema, { ...validTrait(), appliesTo: ['robot'] }));
});

describe('UpdateTraitSchema', () => {
  it('accepts an appliesTo update', () =>
    accepts(UpdateTraitSchema, { appliesTo: ['hero', 'card'] }));
  it('rejects empty appliesTo', () => rejects(UpdateTraitSchema, { appliesTo: [] }));
});

describe('CreateCardSchema — basic shape', () => {
  it('accepts a valid summon card', () => accepts(CreateCardSchema, validSummonCard()));
  it('accepts a valid spell card', () => accepts(CreateCardSchema, validSpellCard()));
  it('rejects missing universeId', () =>
    rejects(CreateCardSchema, { ...validSummonCard(), universeId: undefined }));
  it('rejects empty name', () =>
    rejects(CreateCardSchema, { ...validSummonCard(), name: '' }));
  it('rejects name above 100 chars', () =>
    rejects(CreateCardSchema, { ...validSummonCard(), name: 'a'.repeat(101) }));
});

describe('CreateCardSchema — cost', () => {
  it('accepts multi-element cost', () =>
    accepts(CreateCardSchema, {
      ...validSummonCard(),
      cost: { fire: 2, water: 1 },
    }));
  it('rejects zero cost amount', () =>
    rejects(CreateCardSchema, { ...validSummonCard(), cost: { fire: 0 } }));
  it('rejects negative cost amount', () =>
    rejects(CreateCardSchema, { ...validSummonCard(), cost: { fire: -1 } }));
});

describe('CreateCardSchema — activation/stats coupling', () => {
  it('rejects emptySlot without stats', () =>
    rejects(CreateCardSchema, {
      id: 'broken',
      universeId: 'eldoria',
      name: 'Broken',
      cost: { fire: 1 },
      activation: 'emptySlot',
    }));
  it('rejects non-emptySlot activation with stats', () =>
    rejects(CreateCardSchema, {
      id: 'broken',
      universeId: 'eldoria',
      name: 'Broken',
      cost: { fire: 1 },
      activation: 'immediate',
      stats: { attack: 1, health: 1 },
    }));
});

describe('CreateCardSchema — abilities', () => {
  const ability = (overrides: object = {}) => ({
    trigger: 'onPlay',
    target: 'self',
    effects: [{ kind: 'damage', params: { amount: 1 } }],
    ...overrides,
  });

  it('accepts an ability with one or more effects', () =>
    accepts(CreateCardSchema, { ...validSummonCard(), abilities: [ability()] }));
  it('rejects empty effects array', () =>
    rejects(CreateCardSchema, {
      ...validSummonCard(),
      abilities: [ability({ effects: [] })],
    }));
  it('rejects neither trigger nor passive', () =>
    rejects(CreateCardSchema, {
      ...validSummonCard(),
      abilities: [
        {
          target: 'self',
          effects: [{ kind: 'damage', params: { amount: 1 } }],
        },
      ],
    }));
  it('rejects both trigger and passive', () =>
    rejects(CreateCardSchema, {
      ...validSummonCard(),
      abilities: [ability({ passive: true })],
    }));
  it('rejects unknown trigger', () =>
    rejects(CreateCardSchema, {
      ...validSummonCard(),
      abilities: [ability({ trigger: 'onMystery' })],
    }));
  it('rejects unknown target', () =>
    rejects(CreateCardSchema, {
      ...validSummonCard(),
      abilities: [ability({ target: 'mysterious' })],
    }));
});

describe('CreateCardSchema — effects', () => {
  const cardWith = (effect: unknown) => ({
    ...validSummonCard(),
    abilities: [{ trigger: 'onPlay', target: 'self', effects: [effect] }],
  });

  it('rejects unknown effect kind', () =>
    rejects(CreateCardSchema, cardWith({ kind: 'mysteryKind', params: { amount: 1 } })));
  it('rejects effect params that violate the kind schema', () =>
    rejects(CreateCardSchema, cardWith({ kind: 'damage', params: {} })));
});

describe('CreateCardSchema — expressions', () => {
  const cardWithDamageExpr = (amount: unknown) => ({
    ...validSummonCard(),
    abilities: [
      {
        trigger: 'onPlay',
        target: 'self',
        effects: [{ kind: 'damage', params: { amount } }],
      },
    ],
  });

  it('rejects unknown operator key', () =>
    rejects(CreateCardSchema, cardWithDamageExpr({ foo: [1, 2] })));
  it('rejects wrong arity for binary operator', () =>
    rejects(CreateCardSchema, cardWithDamageExpr({ eq: [1] })));
});

describe('UpdateCardSchema', () => {
  it('accepts an empty patch', () => accepts(UpdateCardSchema, {}));
  it('accepts a name change', () => accepts(UpdateCardSchema, { name: 'New' }));
  it('rejects empty name', () => rejects(UpdateCardSchema, { name: '' }));
  it('rejects zero cost amount', () =>
    rejects(UpdateCardSchema, { cost: { fire: 0 } }));
});

describe('CreateHeroSchema', () => {
  it('accepts a valid hero', () => accepts(CreateHeroSchema, validHero()));
  it('accepts hero with a faction', () =>
    accepts(CreateHeroSchema, { ...validHero(), faction: 'orderOfAsh' }));
  it('rejects missing universeId', () =>
    rejects(CreateHeroSchema, { ...validHero(), universeId: undefined }));
  it('rejects empty name', () =>
    rejects(CreateHeroSchema, { ...validHero(), name: '' }));
  it('rejects name above 100 chars', () =>
    rejects(CreateHeroSchema, { ...validHero(), name: 'a'.repeat(101) }));
  it('rejects negative element amount', () =>
    rejects(CreateHeroSchema, { ...validHero(), elements: { fire: -1 } }));
});

describe('UpdateHeroSchema', () => {
  it('accepts an empty patch', () => accepts(UpdateHeroSchema, {}));
  it('accepts a name change', () => accepts(UpdateHeroSchema, { name: 'Renamed' }));
  it('accepts a faction change', () =>
    accepts(UpdateHeroSchema, { faction: 'orderOfAsh' }));
  it('rejects empty name', () => rejects(UpdateHeroSchema, { name: '' }));
  it('rejects negative element amount', () =>
    rejects(UpdateHeroSchema, { elements: { fire: -1 } }));
});
