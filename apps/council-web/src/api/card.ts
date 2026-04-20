import { useQuery } from '@tanstack/react-query';

import type { CardDto } from '@dod/api-contract';

import { client } from './client';

const cardKeys = {
  all: ['cards'] as const,
};

export function useCards() {
  return useQuery({
    queryKey: cardKeys.all,
    queryFn: () => client.get<CardDto[]>('/api/v1/card'),
    select: (envelope) => envelope.data,
    initialData: { data: [] as CardDto[] },
  });
}
