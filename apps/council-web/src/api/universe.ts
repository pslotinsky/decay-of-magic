import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type {
  CreateUniverseDto,
  UniverseDto,
  UpdateUniverseDto,
} from '@dod/api-contract';

import { client } from './client';

const universeKeys = {
  all: ['universes'] as const,
  detail: (id: string) => ['universes', id] as const,
};

export function useUniverses() {
  return useQuery({
    queryKey: universeKeys.all,
    queryFn: () => client.get<UniverseDto[]>('/api/v1/universe'),
    select: (envelope) => envelope.data,
  });
}

export function useUniverse(id: string) {
  return useQuery({
    queryKey: universeKeys.detail(id),
    queryFn: () => client.get<UniverseDto>(`/api/v1/universe/${id}`),
    select: (envelope) => envelope.data,
  });
}

export function useCreateUniverse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateUniverseDto) => {
      const envelope = await client.post<UniverseDto>(
        '/api/v1/universe',
        payload,
      );
      return envelope.data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: universeKeys.all }),
  });
}

export function useUpdateUniverse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...payload
    }: UpdateUniverseDto & { id: string }) => {
      const envelope = await client.patch<UniverseDto>(
        `/api/v1/universe/${id}`,
        payload,
      );
      return envelope.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: universeKeys.all });
      queryClient.invalidateQueries({
        queryKey: universeKeys.detail(variables.id),
      });
    },
  });
}
