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
    queryFn: () => client.get('/api/v1/citizen').json<CitizenDto[]>(),
  });
}

export function useRegisterCitizen() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ nickname, secret }: RegisterCitizenInput) =>
      client
        .post('/api/v1/citizen', { json: { nickname, secret } })
        .json<CitizenDto>(),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: citizenKeys.all }),
  });
}

export function useUpdateCitizen() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, nickname }: UpdateCitizenInput) =>
      client
        .patch(`/api/v1/citizen/${id}`, { json: { nickname } })
        .json<CitizenDto>(),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: citizenKeys.all }),
  });
}
