import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { req } from '../lib/http';

export type CitizenDto = { id: string; nickname: string };

const citizenKeys = {
  all: ['citizens'] as const,
};

export function useCitizens() {
  return useQuery({
    queryKey: citizenKeys.all,
    queryFn: () => req<CitizenDto[]>('/api/v1/citizen'),
  });
}

export function useRegisterCitizen() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ nickname, secret }: { nickname: string; secret: string }) =>
      req<CitizenDto>('/api/v1/citizen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, secret }),
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: citizenKeys.all }),
  });
}

export function useUpdateCitizen() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, nickname }: { id: string; nickname: string }) =>
      req<CitizenDto>(`/api/v1/citizen/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname }),
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: citizenKeys.all }),
  });
}
