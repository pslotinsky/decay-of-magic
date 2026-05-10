import { type SyntheticEvent, useMemo, useState } from 'react';

import {
  type AbilityDto,
  type Activation,
  type CardDto,
  type ElementDto,
  type Expression,
  type FactionDto,
  isMinionActivation,
  type StatDto,
  type TraitDto,
} from '@dod/api-contract';

import { nameToSlug } from '@/util/slug';

export interface CardFormPayload {
  id: string;
  name: string;
  description?: string;
  art?: string;
  activation: Activation;
  factions?: string[];
  cost?: Record<string, number>;
  stats?: Record<string, Expression>;
  traits?: string[];
  abilities?: AbilityDto[];
}

interface Params {
  initial?: Partial<CardDto>;
  elements: ElementDto[];
  factions: FactionDto[];
  stats: StatDto[];
  traits: TraitDto[];
  onSubmit: (payload: CardFormPayload) => void;
}

export function useCodexCardForm({
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
  const [activation, setActivation] = useState<Activation>(
    initial?.activation ?? 'emptySlot',
  );
  const [factionIds, setFactionIds] = useState<Set<string>>(
    new Set(initial?.factions ?? []),
  );
  const [cost, setCostState] = useState<Record<string, number>>(
    Object.fromEntries(
      Object.entries(initial?.cost ?? {}).map(([slug, value]) => [
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

  function toggleFaction(factionId: string) {
    setFactionIds((current) => toggleSet(current, factionId));
  }

  function toggleTrait(traitId: string) {
    setTraitIds((current) => toggleSet(current, traitId));
  }

  function setCost(slug: string, raw: string) {
    setCostState((current) => {
      if (raw === '') {
        const next = { ...current };
        delete next[slug];
        return next;
      }
      return { ...current, [slug]: Number(raw) };
    });
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

  const minionStats = useMemo(
    () => stats.filter((stat) => stat.appliesTo.includes('minion')),
    [stats],
  );

  const visibleMinionStats = useMemo(
    () =>
      minionStats.filter(
        (stat) => stat.required || shownOptionalStats.has(stat.id),
      ),
    [minionStats, shownOptionalStats],
  );

  const addableMinionStats = useMemo(
    () =>
      minionStats.filter(
        (stat) => !stat.required && !shownOptionalStats.has(stat.id),
      ),
    [minionStats, shownOptionalStats],
  );

  const availableElements = useMemo(() => {
    const allowed = new Set(
      factions.flatMap((faction) =>
        factionIds.has(faction.id) ? (faction.elements ?? []) : [],
      ),
    );
    return elements.filter((element) => allowed.has(element.id));
  }, [elements, factions, factionIds]);

  const traitScope = isMinionActivation(activation) ? 'minion' : 'card';
  const filteredTraits = useMemo(
    () => traits.filter((trait) => trait.appliesTo.includes(traitScope)),
    [traits, traitScope],
  );

  const applicableTraitIds = useMemo(() => {
    const allowed = new Set(filteredTraits.map((trait) => trait.id));
    const next = new Set<string>();
    for (const traitId of traitIds) if (allowed.has(traitId)) next.add(traitId);
    return next;
  }, [filteredTraits, traitIds]);

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(
      buildPayload({
        id,
        name,
        description,
        art,
        activation,
        factionIds,
        cost,
        availableElements,
        statValues,
        applicableTraitIds,
        abilities,
        minionStats,
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
    activation,
    setActivation,
    factionIds,
    toggleFaction,
    cost,
    setCost,
    availableElements,
    statValues,
    updateStat,
    clearStat,
    traitIds: applicableTraitIds,
    toggleTrait,
    filteredTraits,
    minionStats,
    visibleMinionStats,
    addableMinionStats,
    showOptionalStat,
    removeOptionalStat,
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
  activation: Activation;
  factionIds: Set<string>;
  cost: Record<string, number>;
  availableElements: ElementDto[];
  statValues: Record<string, Expression>;
  applicableTraitIds: Set<string>;
  abilities: AbilityDto[];
  minionStats: StatDto[];
}

function buildPayload(state: BuildArgs): CardFormPayload {
  const allowedElementIds = new Set(
    state.availableElements.map((element) => element.id),
  );
  const filteredCost: Record<string, number> = {};
  for (const [slug, value] of Object.entries(state.cost)) {
    if (allowedElementIds.has(slug) && Number.isFinite(value) && value > 0) {
      filteredCost[slug] = value;
    }
  }

  const payload: CardFormPayload = {
    id: state.id,
    name: state.name,
    activation: state.activation,
  };
  if (state.description) payload.description = state.description;
  if (state.art) payload.art = state.art;
  if (state.factionIds.size > 0) payload.factions = [...state.factionIds];
  if (Object.keys(filteredCost).length > 0) payload.cost = filteredCost;
  if (isMinionActivation(state.activation)) {
    const filteredStats: Record<string, Expression> = {};
    for (const stat of state.minionStats) {
      const value = state.statValues[stat.id];
      if (value !== undefined && value !== 0) {
        filteredStats[stat.id] = value;
      }
    }
    payload.stats = filteredStats;
  }
  if (state.applicableTraitIds.size > 0) {
    payload.traits = [...state.applicableTraitIds];
  }
  if (state.abilities.length > 0) payload.abilities = state.abilities;

  return payload;
}

function toggleSet(set: Set<string>, value: string): Set<string> {
  const next = new Set(set);
  if (next.has(value)) {
    next.delete(value);
  } else {
    next.add(value);
  }
  return next;
}
