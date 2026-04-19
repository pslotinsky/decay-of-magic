import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type {
  CitizenDto,
  RegisterCitizenDto,
  UpdateCitizenDto,
} from '@dod/api-contract';

import { client } from './client';

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
    mutationFn: async (payload: RegisterCitizenDto) => {
      const envelope = await client.post<CitizenDto>(
        '/api/v1/citizen',
        payload,
      );
      return envelope.data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: citizenKeys.all }),
  });
}

export function useUpdateCitizen() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...payload
    }: UpdateCitizenDto & { id: string }) => {
      const envelope = await client.patch<CitizenDto>(
        `/api/v1/citizen/${id}`,
        payload,
      );
      return envelope.data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: citizenKeys.all }),
  });
}
