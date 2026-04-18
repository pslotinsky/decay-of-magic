import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { req } from '../lib/http';

export type UniverseDto = {
  id: string;
  name: string;
  description?: string;
  cover?: string;
};

const universeKeys = {
  all: ['universes'] as const,
  detail: (id: string) => ['universes', id] as const,
};

export function useUniverses() {
  return useQuery({
    queryKey: universeKeys.all,
    queryFn: () => req<UniverseDto[]>('/api/v1/universe'),
  });
}

export function useUniverse(id: string) {
  return useQuery({
    queryKey: universeKeys.detail(id),
    queryFn: () => req<UniverseDto>(`/api/v1/universe/${id}`),
  });
}

export function useCreateUniverse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      id: string;
      name: string;
      description?: string;
      cover?: string;
    }) =>
      req<UniverseDto>('/api/v1/universe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: universeKeys.all }),
  });
}

export function useUpdateUniverse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...data
    }: {
      id: string;
      name?: string;
      description?: string;
      cover?: string;
    }) =>
      req<UniverseDto>(`/api/v1/universe/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: universeKeys.all });
      queryClient.invalidateQueries({
        queryKey: universeKeys.detail(variables.id),
      });
    },
  });
}
