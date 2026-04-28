import {
  CreateCardDto,
  CreateElementDto,
  CreateFactionDto,
  CreateHeroDto,
  CreateStatDto,
  CreateTraitDto,
} from '@dod/api-contract';

export const mocker = {
  element: {
    createBody: (
      overrides: Partial<CreateElementDto> = {},
    ): CreateElementDto => ({
      id: 'fire',
      universeId: 'eldoria',
      name: 'Fire',
      ...overrides,
    }),
  },
  faction: {
    createBody: (
      overrides: Partial<CreateFactionDto> = {},
    ): CreateFactionDto => ({
      id: 'orderOfAsh',
      universeId: 'eldoria',
      name: 'Order of Ash',
      ...overrides,
    }),
  },
  stat: {
    createBody: (overrides: Partial<CreateStatDto> = {}): CreateStatDto => ({
      id: 'attack',
      universeId: 'eldoria',
      name: 'Attack',
      appliesTo: ['minion'],
      ...overrides,
    }),
  },
  trait: {
    createBody: (overrides: Partial<CreateTraitDto> = {}): CreateTraitDto => ({
      id: 'wall',
      universeId: 'eldoria',
      name: 'Wall',
      appliesTo: ['minion'],
      ...overrides,
    }),
  },
  card: {
    createSummonBody: (overrides: Partial<CreateCardDto> = {}): CreateCardDto =>
      ({
        id: 'goblinBerserker',
        universeId: 'eldoria',
        name: 'Goblin Berserker',
        cost: { fire: 1 },
        stats: { attack: 4, health: 16 },
        activation: 'emptySlot',
        ...overrides,
      }) as CreateCardDto,
    createSpellBody: (overrides: Partial<CreateCardDto> = {}): CreateCardDto =>
      ({
        id: 'fireball',
        universeId: 'eldoria',
        name: 'Fireball',
        cost: { fire: 5 },
        activation: 'immediate',
        ...overrides,
      }) as CreateCardDto,
  },
  hero: {
    createBody: (overrides: Partial<CreateHeroDto> = {}): CreateHeroDto =>
      ({
        id: 'archmage',
        universeId: 'eldoria',
        name: 'Archmage',
        elements: { fire: 5, water: 5 },
        ...overrides,
      }) as CreateHeroDto,
  },
};
