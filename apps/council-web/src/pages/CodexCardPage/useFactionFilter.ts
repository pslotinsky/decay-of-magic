import { useEffect } from 'react';
import { useSearchParams } from 'react-router';

import type { FactionDto } from '@dod/api-contract';

const PARAM_KEY = 'faction';

export function useFactionFilter(
  factions: FactionDto[],
  loading: boolean,
): [string, (value: string) => void] {
  const [searchParams, setSearchParams] = useSearchParams();
  const factionFilter = searchParams.get(PARAM_KEY) ?? '';

  function setFactionFilter(value: string) {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);

        if (value) {
          next.set(PARAM_KEY, value);
        } else {
          next.delete(PARAM_KEY);
        }

        return next;
      },
      { replace: true },
    );
  }

  useEffect(() => {
    if (loading) return;
    if (factions.length === 0) {
      if (factionFilter) setFactionFilter('');
      return;
    }
    if (!factions.some((faction) => faction.id === factionFilter)) {
      setFactionFilter(factions[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [factions, factionFilter, loading]);

  return [factionFilter, setFactionFilter];
}
