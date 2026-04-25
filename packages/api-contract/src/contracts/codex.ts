import { z } from 'zod';

const Slug = z.string().regex(/^[a-z][a-zA-Z0-9]*$/, 'must be camelCase');
const ShortName = z.string().min(1).max(50);
const LongName = z.string().min(1).max(100);
const Description = z.string().max(500);
const UniverseId = z.string().min(1);

export const APPLIES_TO_VALUES = ['minion', 'hero', 'card'] as const;
export const AppliesToSchema = z.array(z.enum(APPLIES_TO_VALUES)).min(1);
export type AppliesTo = z.infer<typeof AppliesToSchema>;

export const TRIGGER_VALUES = [
  'onPlay',
  'onTurnStart',
  'onTurnEnd',
  'onDeath',
  'onDamaged',
  'onBeforeDamage',
  'onAttack',
  'onBeforeAttack',
  'onSummon',
] as const;
export const TriggerSchema = z.enum(TRIGGER_VALUES);
export type Trigger = z.infer<typeof TriggerSchema>;

export const TARGET_VALUES = [
  'self',
  'ownerHero',
  'enemyHero',
  'chosen',
  'neighbors',
  'ownerMinions',
  'enemyMinions',
  'allMinions',
] as const;
export const TargetSchema = z.enum(TARGET_VALUES);
export type Target = z.infer<typeof TargetSchema>;

export const ACTIVATION_VALUES = [
  'emptySlot',
  'enemyMinion',
  'ownerMinion',
  'immediate',
] as const;
export const ActivationSchema = z.enum(ACTIVATION_VALUES);
export type Activation = z.infer<typeof ActivationSchema>;

export const EFFECT_KIND_VALUES = [
  'damage',
  'heal',
  'fullHeal',
  'gainElement',
  'increaseStat',
  'decreaseStat',
  'multiplyStat',
  'setStat',
  'giveTraits',
  'removeTraits',
  'summon',
  'destroy',
  'attackNow',
  'preventDamage',
  'reflectDamage',
] as const;
export const EffectKindSchema = z.enum(EFFECT_KIND_VALUES);
export type EffectKind = z.infer<typeof EffectKindSchema>;

export type Expression =
  | string
  | number
  | boolean
  | { not: Expression }
  | { and: Expression[] }
  | { or: Expression[] }
  | { eq: [Expression, Expression] }
  | { ne: [Expression, Expression] }
  | { lt: [Expression, Expression] }
  | { lte: [Expression, Expression] }
  | { gt: [Expression, Expression] }
  | { gte: [Expression, Expression] }
  | { add: Expression[] }
  | { sub: [Expression, Expression] }
  | { mul: Expression[] }
  | { div: [Expression, Expression] }
  | { min: Expression[] }
  | { max: Expression[] }
  | { contains: [Expression, Expression] };

export const ExpressionSchema: z.ZodType<Expression> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.strictObject({ not: ExpressionSchema }),
    z.strictObject({ and: z.array(ExpressionSchema).min(2) }),
    z.strictObject({ or: z.array(ExpressionSchema).min(2) }),
    z.strictObject({
      eq: z.tuple([ExpressionSchema, ExpressionSchema]),
    }),
    z.strictObject({
      ne: z.tuple([ExpressionSchema, ExpressionSchema]),
    }),
    z.strictObject({
      lt: z.tuple([ExpressionSchema, ExpressionSchema]),
    }),
    z.strictObject({
      lte: z.tuple([ExpressionSchema, ExpressionSchema]),
    }),
    z.strictObject({
      gt: z.tuple([ExpressionSchema, ExpressionSchema]),
    }),
    z.strictObject({
      gte: z.tuple([ExpressionSchema, ExpressionSchema]),
    }),
    z.strictObject({ add: z.array(ExpressionSchema).min(2) }),
    z.strictObject({
      sub: z.tuple([ExpressionSchema, ExpressionSchema]),
    }),
    z.strictObject({ mul: z.array(ExpressionSchema).min(2) }),
    z.strictObject({
      div: z.tuple([ExpressionSchema, ExpressionSchema]),
    }),
    z.strictObject({ min: z.array(ExpressionSchema).min(2) }),
    z.strictObject({ max: z.array(ExpressionSchema).min(2) }),
    z.strictObject({
      contains: z.tuple([ExpressionSchema, ExpressionSchema]),
    }),
  ]),
);

const StatBlockSchema = z.record(Slug, ExpressionSchema);
const CostSchema = z.record(Slug, z.int().positive());
const ElementsPoolSchema = z.record(Slug, z.int().nonnegative());

const EffectSchema = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('damage'),
    params: z.strictObject({ amount: ExpressionSchema }),
    filter: ExpressionSchema.optional(),
  }),
  z.object({
    kind: z.literal('heal'),
    params: z.strictObject({ amount: ExpressionSchema }),
    filter: ExpressionSchema.optional(),
  }),
  z.object({
    kind: z.literal('fullHeal'),
    params: z.strictObject({}),
    filter: ExpressionSchema.optional(),
  }),
  z.object({
    kind: z.literal('gainElement'),
    params: z.record(Slug, ExpressionSchema),
    filter: ExpressionSchema.optional(),
  }),
  z.object({
    kind: z.literal('increaseStat'),
    params: z.record(Slug, ExpressionSchema),
    filter: ExpressionSchema.optional(),
  }),
  z.object({
    kind: z.literal('decreaseStat'),
    params: z.record(Slug, ExpressionSchema),
    filter: ExpressionSchema.optional(),
  }),
  z.object({
    kind: z.literal('multiplyStat'),
    params: z.record(Slug, ExpressionSchema),
    filter: ExpressionSchema.optional(),
  }),
  z.object({
    kind: z.literal('setStat'),
    params: z.record(Slug, ExpressionSchema),
    filter: ExpressionSchema.optional(),
  }),
  z.object({
    kind: z.literal('giveTraits'),
    params: z.strictObject({
      traits: z.array(Slug).min(1),
      duration: z.int().positive().optional(),
    }),
    filter: ExpressionSchema.optional(),
  }),
  z.object({
    kind: z.literal('removeTraits'),
    params: z.strictObject({ traits: z.array(Slug).min(1) }),
    filter: ExpressionSchema.optional(),
  }),
  z.object({
    kind: z.literal('summon'),
    params: z.strictObject({ minion: Slug }),
    filter: ExpressionSchema.optional(),
  }),
  z.object({
    kind: z.literal('destroy'),
    params: z.strictObject({}),
    filter: ExpressionSchema.optional(),
  }),
  z.object({
    kind: z.literal('attackNow'),
    params: z.strictObject({}),
    filter: ExpressionSchema.optional(),
  }),
  z.object({
    kind: z.literal('preventDamage'),
    params: z.strictObject({}),
    filter: ExpressionSchema.optional(),
  }),
  z.object({
    kind: z.literal('reflectDamage'),
    params: z.strictObject({}),
    filter: ExpressionSchema.optional(),
  }),
]);
export type EffectDto = z.infer<typeof EffectSchema>;
export { EffectSchema };

const TriggeredAbilitySchema = z.strictObject({
  trigger: TriggerSchema,
  target: TargetSchema,
  exclude: ExpressionSchema.optional(),
  effects: z.array(EffectSchema).min(1),
});

const PassiveAbilitySchema = z.strictObject({
  passive: z.literal(true),
  target: TargetSchema,
  exclude: ExpressionSchema.optional(),
  effects: z.array(EffectSchema).min(1),
});

export const AbilitySchema = z.union([
  TriggeredAbilitySchema,
  PassiveAbilitySchema,
]);
export type AbilityDto = z.infer<typeof AbilitySchema>;

export const ElementSchema = z.object({
  id: Slug,
  universeId: UniverseId,
  name: ShortName,
});
export type ElementDto = z.infer<typeof ElementSchema>;

export const CreateElementSchema = ElementSchema;
export type CreateElementDto = z.infer<typeof CreateElementSchema>;

export const UpdateElementSchema = z.object({
  name: ShortName.optional(),
});
export type UpdateElementDto = z.infer<typeof UpdateElementSchema>;

export const FactionSchema = z.object({
  id: Slug,
  universeId: UniverseId,
  name: ShortName,
});
export type FactionDto = z.infer<typeof FactionSchema>;

export const CreateFactionSchema = FactionSchema;
export type CreateFactionDto = z.infer<typeof CreateFactionSchema>;

export const UpdateFactionSchema = z.object({
  name: ShortName.optional(),
});
export type UpdateFactionDto = z.infer<typeof UpdateFactionSchema>;

export const StatSchema = z.object({
  id: Slug,
  universeId: UniverseId,
  name: ShortName,
  appliesTo: AppliesToSchema,
});
export type StatDto = z.infer<typeof StatSchema>;

export const CreateStatSchema = StatSchema;
export type CreateStatDto = z.infer<typeof CreateStatSchema>;

export const UpdateStatSchema = z.object({
  name: ShortName.optional(),
  appliesTo: AppliesToSchema.optional(),
});
export type UpdateStatDto = z.infer<typeof UpdateStatSchema>;

export const TraitSchema = z.object({
  id: Slug,
  universeId: UniverseId,
  name: ShortName,
  appliesTo: AppliesToSchema,
});
export type TraitDto = z.infer<typeof TraitSchema>;

export const CreateTraitSchema = TraitSchema;
export type CreateTraitDto = z.infer<typeof CreateTraitSchema>;

export const UpdateTraitSchema = z.object({
  name: ShortName.optional(),
  appliesTo: AppliesToSchema.optional(),
});
export type UpdateTraitDto = z.infer<typeof UpdateTraitSchema>;

const cardActivationStatsCoupling = (data: {
  activation: Activation;
  stats?: unknown;
}): boolean => (data.activation === 'emptySlot') === (data.stats !== undefined);

const cardActivationStatsMessage =
  '`stats` is required when `activation` is `emptySlot` and forbidden otherwise';

export const CardSchema = z
  .object({
    id: Slug,
    universeId: UniverseId,
    name: LongName,
    description: Description.optional(),
    art: z.url().optional(),
    factions: z.array(Slug).optional(),
    cost: CostSchema.optional(),
    stats: StatBlockSchema.optional(),
    traits: z.array(Slug).optional(),
    activation: ActivationSchema,
    abilities: z.array(AbilitySchema).optional(),
  })
  .refine(cardActivationStatsCoupling, {
    message: cardActivationStatsMessage,
    path: ['stats'],
  });
export type CardDto = z.infer<typeof CardSchema>;

export const CreateCardSchema = CardSchema;
export type CreateCardDto = z.infer<typeof CreateCardSchema>;

export const UpdateCardSchema = z.object({
  name: LongName.optional(),
  description: Description.optional(),
  art: z.url().optional(),
  factions: z.array(Slug).optional(),
  cost: CostSchema.optional(),
  stats: StatBlockSchema.optional(),
  traits: z.array(Slug).optional(),
  activation: ActivationSchema.optional(),
  abilities: z.array(AbilitySchema).optional(),
});
export type UpdateCardDto = z.infer<typeof UpdateCardSchema>;

export const HeroSchema = z.object({
  id: Slug,
  universeId: UniverseId,
  name: LongName,
  description: Description.optional(),
  art: z.url().optional(),
  faction: Slug.optional(),
  elements: ElementsPoolSchema,
  stats: StatBlockSchema.optional(),
  traits: z.array(Slug).optional(),
  abilities: z.array(AbilitySchema).optional(),
});
export type HeroDto = z.infer<typeof HeroSchema>;

export const CreateHeroSchema = HeroSchema;
export type CreateHeroDto = z.infer<typeof CreateHeroSchema>;

export const UpdateHeroSchema = z.object({
  name: LongName.optional(),
  description: Description.optional(),
  art: z.url().optional(),
  faction: Slug.optional(),
  elements: ElementsPoolSchema.optional(),
  stats: StatBlockSchema.optional(),
  traits: z.array(Slug).optional(),
  abilities: z.array(AbilitySchema).optional(),
});
export type UpdateHeroDto = z.infer<typeof UpdateHeroSchema>;
