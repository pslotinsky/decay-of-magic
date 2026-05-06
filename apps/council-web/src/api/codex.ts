import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type {
  CardDto,
  CreateCardDto,
  CreateElementDto,
  CreateFactionDto,
  CreateHeroDto,
  CreateStatDto,
  CreateTraitDto,
  ElementDto,
  FactionDto,
  HeroDto,
  StatDto,
  TraitDto,
  UpdateCardDto,
  UpdateElementDto,
  UpdateFactionDto,
  UpdateHeroDto,
  UpdateStatDto,
  UpdateTraitDto,
} from '@dod/api-contract';

import { client } from './client';

export const useElements = (universeId: string) =>
  useList<ElementDto>('element', universeId);
export const useCreateElement = () =>
  useCreate<ElementDto, CreateElementDto>('element');
export const useUpdateElement = () =>
  useUpdate<ElementDto, UpdateElementDto>('element');

export const useFactions = (universeId: string) =>
  useList<FactionDto>('faction', universeId);
export const useCreateFaction = () =>
  useCreate<FactionDto, CreateFactionDto>('faction');
export const useUpdateFaction = () =>
  useUpdate<FactionDto, UpdateFactionDto>('faction');

export const useStats = (universeId: string) =>
  useList<StatDto>('stat', universeId);
export const useCreateStat = () => useCreate<StatDto, CreateStatDto>('stat');
export const useUpdateStat = () => useUpdate<StatDto, UpdateStatDto>('stat');

export const useTraits = (universeId: string) =>
  useList<TraitDto>('trait', universeId);
export const useCreateTrait = () =>
  useCreate<TraitDto, CreateTraitDto>('trait');
export const useUpdateTrait = () =>
  useUpdate<TraitDto, UpdateTraitDto>('trait');

export const useCards = (universeId: string) =>
  useList<CardDto>('card', universeId);
export const useCreateCard = () => useCreate<CardDto, CreateCardDto>('card');
export const useUpdateCard = () => useUpdate<CardDto, UpdateCardDto>('card');

export const useHeroes = (universeId: string) =>
  useList<HeroDto>('hero', universeId);
export const useCreateHero = () => useCreate<HeroDto, CreateHeroDto>('hero');
export const useUpdateHero = () => useUpdate<HeroDto, UpdateHeroDto>('hero');

type Kind = 'element' | 'faction' | 'stat' | 'trait' | 'card' | 'hero';

const codexKeys = {
  list: (kind: Kind, universeId: string) =>
    ['codex', kind, 'list', universeId] as const,
};

function useList<TDto>(kind: Kind, universeId: string) {
  return useQuery({
    queryKey: codexKeys.list(kind, universeId),
    queryFn: () =>
      client.get<TDto[]>(
        `/api/v1/${kind}?universeId=${encodeURIComponent(universeId)}`,
      ),
    select: (envelope) => envelope.data,
    enabled: Boolean(universeId),
  });
}

function useCreate<TDto, TBody extends { universeId: string }>(kind: Kind) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: TBody) => {
      const envelope = await client.post<TDto>(`/api/v1/${kind}`, payload);
      return envelope.data;
    },
    onSuccess: (_data, variables) =>
      queryClient.invalidateQueries({
        queryKey: codexKeys.list(kind, variables.universeId),
      }),
  });
}

function useUpdate<TDto, TBody>(kind: Kind) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: TBody & { id: string }) => {
      const envelope = await client.patch<TDto>(
        `/api/v1/${kind}/${id}`,
        payload,
      );
      return envelope.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['codex', kind, 'list'] });
    },
  });
}
