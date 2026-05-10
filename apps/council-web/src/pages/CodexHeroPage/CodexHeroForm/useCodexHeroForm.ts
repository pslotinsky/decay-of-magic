import { type SyntheticEvent, useMemo, useState } from 'react';

import type {
  AbilityDto,
  ElementDto,
  Expression,
  FactionDto,
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
  factions: FactionDto[];
  stats: StatDto[];
  traits: TraitDto[];
  onSubmit: (payload: HeroFormPayload) => void;
}

export function useCodexHeroForm({
  initial,
  elements,
  factions,
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
  const [shownOptionalStats, setShownOptionalStats] = useState<Set<string>>(
    () => new Set(Object.keys(initial?.stats ?? {})),
  );
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

  function clearStat(slug: string) {
    setStatValues((current) => {
      const next = { ...current };
      delete next[slug];
      return next;
    });
  }

  function showOptionalStat(slug: string) {
    setShownOptionalStats((current) => {
      const next = new Set(current);
      next.add(slug);
      return next;
    });
  }

  function removeOptionalStat(slug: string) {
    setShownOptionalStats((current) => {
      const next = new Set(current);
      next.delete(slug);
      return next;
    });
    clearStat(slug);
  }

  const heroStats = useMemo(
    () => stats.filter((stat) => stat.appliesTo.includes('hero')),
    [stats],
  );

  const visibleHeroStats = useMemo(
    () =>
      heroStats.filter(
        (stat) => stat.required || shownOptionalStats.has(stat.id),
      ),
    [heroStats, shownOptionalStats],
  );

  const addableHeroStats = useMemo(
    () =>
      heroStats.filter(
        (stat) => !stat.required && !shownOptionalStats.has(stat.id),
      ),
    [heroStats, shownOptionalStats],
  );

  const heroTraits = useMemo(
    () => traits.filter((trait) => trait.appliesTo.includes('hero')),
    [traits],
  );

  const availableElements = useMemo(() => {
    let result = elements;

    const heroFaction = factions.find((entry) => entry.id === faction);

    if (heroFaction) {
      const allowed = new Set(heroFaction.elements);
      result = elements.filter((element) => allowed.has(element.id));
    }

    return result;
  }, [elements, factions, faction]);

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(
      buildPayload({
        id,
        name,
        description,
        art,
        faction,
        availableElements,
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
    availableElements,
    elementValues,
    updateElement,
    statValues,
    updateStat,
    clearStat,
    traitIds,
    toggleTrait,
    heroStats,
    visibleHeroStats,
    addableHeroStats,
    showOptionalStat,
    removeOptionalStat,
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
  availableElements: ElementDto[];
  elementValues: Record<string, number>;
  statValues: Record<string, Expression>;
  traitIds: Set<string>;
  abilities: AbilityDto[];
  heroStats: StatDto[];
}

function buildPayload(state: BuildArgs): HeroFormPayload {
  const elementsPayload: Record<string, number> = {};
  for (const element of state.availableElements) {
    const value = state.elementValues[element.id];
    if (Number.isFinite(value) && value > 0) {
      elementsPayload[element.id] = value;
    }
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
    const value = state.statValues[stat.id];
    if (value !== undefined && value !== 0) {
      statsPayload[stat.id] = value;
    }
  }
  if (Object.keys(statsPayload).length > 0) payload.stats = statsPayload;
  if (state.traitIds.size > 0) payload.traits = [...state.traitIds];
  if (state.abilities.length > 0) payload.abilities = state.abilities;

  return payload;
}
