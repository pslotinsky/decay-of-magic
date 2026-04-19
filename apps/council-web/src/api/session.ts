import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { CitizenDto } from './citizen';
import { client } from './client';

export type LoginCredentials = { nickname: string; secret: string };

export const sessionKeys = {
  me: ['me'] as const,
};

export function useMeQuery() {
  return useQuery({
    queryKey: sessionKeys.me,
    queryFn: async (): Promise<CitizenDto | undefined> => {
      const res = await fetch('/api/v1/citizen/me', { credentials: 'include' });
      return res.ok ? res.json() : undefined;
    },
    retry: false,
    staleTime: Infinity,
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ nickname, secret }: LoginCredentials) =>
      client.post('/api/v1/session', { json: { nickname, secret } }),
    onSuccess: () => queryClient.refetchQueries({ queryKey: sessionKeys.me }),
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => client.delete('/api/v1/session'),
    onSettled: () => queryClient.setQueryData(sessionKeys.me, undefined),
  });
}
