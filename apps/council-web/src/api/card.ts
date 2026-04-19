import { useQuery } from '@tanstack/react-query';

import type { CardDto } from '../components/CardPreview';
import { client } from './client';

const cardKeys = {
  all: ['cards'] as const,
};

export function useCards() {
  return useQuery({
    queryKey: cardKeys.all,
    queryFn: () => client.get('/api/v1/card').json<CardDto[]>(),
    initialData: [],
  });
}
