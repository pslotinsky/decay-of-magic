import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { client } from './client';

export type CitizenDto = { id: string; nickname: string };

export type RegisterCitizenInput = { nickname: string; secret: string };

export type UpdateCitizenInput = { id: string; nickname: string };

const citizenKeys = {
  all: ['citizens'] as const,
};

export function useCitizens() {
  return useQuery({
    queryKey: citizenKeys.all,
    queryFn: () => client.get<CitizenDto[]>('/api/v1/citizen'),
    select: (envelope) => envelope.data,
  });
}

export function useRegisterCitizen() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ nickname, secret }: RegisterCitizenInput) => {
      const envelope = await client.post<CitizenDto>('/api/v1/citizen', {
        nickname,
        secret,
      });
      return envelope.data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: citizenKeys.all }),
  });
}

export function useUpdateCitizen() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, nickname }: UpdateCitizenInput) => {
      const envelope = await client.patch<CitizenDto>(`/api/v1/citizen/${id}`, {
        nickname,
      });
      return envelope.data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: citizenKeys.all }),
  });
}
