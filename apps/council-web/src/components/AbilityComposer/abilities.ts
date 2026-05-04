import type {
  AbilityDto,
  EffectDto,
  EffectKind,
  Expression,
  Targets,
  Trigger,
} from '@dod/api-contract';

export const defaultAbility: AbilityDto = {
  trigger: 'onPlay',
  target: 'self',
  effects: [{ kind: 'damage', params: { amount: 0 } }],
};

export const defaultEffect: EffectDto = {
  kind: 'damage',
  params: { amount: 0 },
};

export function isPassive(
  ability: AbilityDto,
): ability is Extract<AbilityDto, { passive: true }> {
  return 'passive' in ability && ability.passive === true;
}

export function buildPassive(
  target: Targets,
  effects: EffectDto[],
  exclude: Expression | undefined,
): AbilityDto {
  if (exclude === undefined) {
    return { passive: true, target, effects };
  }
  return { passive: true, target, effects, exclude };
}

export function buildTriggered(
  trigger: Trigger,
  target: Targets,
  effects: EffectDto[],
  exclude: Expression | undefined,
): AbilityDto {
  if (exclude === undefined) {
    return { trigger, target, effects };
  }
  return { trigger, target, effects, exclude };
}

export function emptyEffect(kind: EffectKind): EffectDto {
  switch (kind) {
    case 'damage':
    case 'heal':
      return { kind, params: { amount: 0 } };
    case 'fullHeal':
    case 'destroy':
    case 'attackNow':
    case 'preventDamage':
    case 'reflectDamage':
      return { kind, params: {} };
    case 'gainElement':
    case 'increaseStat':
    case 'decreaseStat':
    case 'multiplyStat':
    case 'setStat':
      return { kind, params: {} };
    case 'giveTraits':
      return { kind, params: { traits: [] } };
    case 'removeTraits':
      return { kind, params: { traits: [] } };
    case 'summon':
      return { kind, params: { minion: '' } };
  }
}
