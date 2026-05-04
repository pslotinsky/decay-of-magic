import { type SyntheticEvent, useMemo, useState } from 'react';

import type {
  AbilityDto,
  Activation,
  CardDto,
  Expression,
  StatDto,
  TraitDto,
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
  stats: StatDto[];
  traits: TraitDto[];
  onSubmit: (payload: CardFormPayload) => void;
}

export function useCodexCardForm({ initial, stats, traits, onSubmit }: Params) {
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
  const [cost, setCost] = useState<Record<string, number>>(
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

  function updateCost(slug: string, value: number) {
    setCost((current) => ({ ...current, [slug]: value }));
  }

  function updateStat(slug: string, expr: Expression) {
    setStatValues((current) => ({ ...current, [slug]: expr }));
  }

  const minionStats = useMemo(
    () => stats.filter((stat) => stat.appliesTo.includes('minion')),
    [stats],
  );

  const traitScope = activation === 'emptySlot' ? 'minion' : 'card';
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
    updateCost,
    statValues,
    updateStat,
    traitIds: applicableTraitIds,
    toggleTrait,
    filteredTraits,
    minionStats,
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
  statValues: Record<string, Expression>;
  applicableTraitIds: Set<string>;
  abilities: AbilityDto[];
  minionStats: StatDto[];
}

function buildPayload(state: BuildArgs): CardFormPayload {
  const filteredCost: Record<string, number> = {};
  for (const [slug, value] of Object.entries(state.cost)) {
    if (Number.isFinite(value) && value > 0) filteredCost[slug] = value;
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
  if (state.activation === 'emptySlot') {
    const filteredStats: Record<string, Expression> = {};
    for (const stat of state.minionStats) {
      filteredStats[stat.id] = state.statValues[stat.id] ?? 0;
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
