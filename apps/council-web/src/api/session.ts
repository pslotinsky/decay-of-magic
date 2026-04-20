import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { CitizenDto, CreateSessionDto } from '@dod/api-contract';
import { unwrap } from '@dod/api-contract';

import { client } from './client';

export const sessionKeys = {
  me: ['me'] as const,
};

export function useMeQuery() {
  return useQuery({
    queryKey: sessionKeys.me,
    queryFn: async (): Promise<CitizenDto | undefined> => {
      const response = await fetch('/api/v1/citizen/me', {
        credentials: 'include',
      });

      return response.ok
        ? unwrap<CitizenDto>(await response.json())
        : undefined;
    },
    retry: false,
    staleTime: Infinity,
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (credentials: CreateSessionDto) =>
      client.postEmpty('/api/v1/session', credentials),
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
