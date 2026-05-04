import { type SyntheticEvent, useMemo, useState } from 'react';

import type {
  AbilityDto,
  ElementDto,
  Expression,
  HeroDto,
  StatDto,
  TraitDto,
} from '@dod/api-contract';

import { nameToSlug } from '@/util/slug';

export interface HeroFormPayload {
  id: string;
  name: string;
  description?: string;
  art?: string;
  faction?: string;
  elements: Record<string, number>;
  stats?: Record<string, Expression>;
  traits?: string[];
  abilities?: AbilityDto[];
}

interface Params {
  initial?: HeroDto;
  elements: ElementDto[];
  stats: StatDto[];
  traits: TraitDto[];
  onSubmit: (payload: HeroFormPayload) => void;
}

export function useCodexHeroForm({
  initial,
  elements,
  stats,
  traits,
  onSubmit,
}: Params) {
  const isEditMode = !!initial?.id;
  const [id, setIdState] = useState(initial?.id ?? '');
  const [idTouched, setIdTouched] = useState(isEditMode);
  const [name, setNameState] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [art, setArt] = useState(initial?.art ?? '');
  const [faction, setFaction] = useState(initial?.faction ?? '');
  const [elementValues, setElementValues] = useState<Record<string, number>>(
    Object.fromEntries(
      Object.entries(initial?.elements ?? {}).map(([slug, value]) => [
        slug,
        Number(value),
      ]),
    ),
  );
  const [statValues, setStatValues] = useState<Record<string, Expression>>({
    ...(initial?.stats ?? {}),
  });
  const [traitIds, setTraitIds] = useState<Set<string>>(
    new Set(initial?.traits ?? []),
  );
  const [abilities, setAbilities] = useState<AbilityDto[]>(
    initial?.abilities ?? [],
  );

  function setName(value: string) {
    setNameState(value);
    if (!isEditMode && !idTouched) setIdState(nameToSlug(value));
  }

  function setId(value: string) {
    setIdTouched(true);
    setIdState(value);
  }

  function toggleTrait(traitId: string) {
    setTraitIds((current) => {
      const next = new Set(current);
      if (next.has(traitId)) {
        next.delete(traitId);
      } else {
        next.add(traitId);
      }
      return next;
    });
  }

  function updateElement(slug: string, value: number) {
    setElementValues((current) => ({ ...current, [slug]: value }));
  }

  function updateStat(slug: string, expr: Expression) {
    setStatValues((current) => ({ ...current, [slug]: expr }));
  }

  const heroStats = useMemo(
    () => stats.filter((stat) => stat.appliesTo.includes('hero')),
    [stats],
  );
  const heroTraits = useMemo(
    () => traits.filter((trait) => trait.appliesTo.includes('hero')),
    [traits],
  );

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(
      buildPayload({
        id,
        name,
        description,
        art,
        faction,
        elements,
        elementValues,
        statValues,
        traitIds,
        abilities,
        heroStats,
      }),
    );
  }

  return {
    isEditMode,
    id,
    setId,
    name,
    setName,
    description,
    setDescription,
    art,
    setArt,
    faction,
    setFaction,
    elementValues,
    updateElement,
    statValues,
    updateStat,
    traitIds,
    toggleTrait,
    heroStats,
    heroTraits,
    abilities,
    setAbilities,
    handleSubmit,
  };
}

interface BuildArgs {
  id: string;
  name: string;
  description: string;
  art: string;
  faction: string;
  elements: ElementDto[];
  elementValues: Record<string, number>;
  statValues: Record<string, Expression>;
  traitIds: Set<string>;
  abilities: AbilityDto[];
  heroStats: StatDto[];
}

function buildPayload(state: BuildArgs): HeroFormPayload {
  const elementsPayload: Record<string, number> = {};
  for (const element of state.elements) {
    const value = state.elementValues[element.id];
    elementsPayload[element.id] = Number.isFinite(value) ? (value ?? 0) : 0;
  }

  const payload: HeroFormPayload = {
    id: state.id,
    name: state.name,
    elements: elementsPayload,
  };
  if (state.description) payload.description = state.description;
  if (state.art) payload.art = state.art;
  if (state.faction) payload.faction = state.faction;

  const statsPayload: Record<string, Expression> = {};
  for (const stat of state.heroStats) {
    statsPayload[stat.id] = state.statValues[stat.id] ?? 0;
  }
  if (Object.keys(statsPayload).length > 0) payload.stats = statsPayload;
  if (state.traitIds.size > 0) payload.traits = [...state.traitIds];
  if (state.abilities.length > 0) payload.abilities = state.abilities;

  return payload;
}
