import { useMemo, useState } from 'react';
import { useParams } from 'react-router';

import type { CardDto } from '@dod/api-contract';

import { useCards, useFactions } from '@/api/codex';
import { useUniverse } from '@/api/universe';
import { Button } from '@/components/Button';
import { ErrorText } from '@/components/ErrorText';
import { UniverseNav } from '@/components/NavMenu';
import { Page, PageHeader } from '@/components/Page';
import { PillToggle } from '@/components/PillToggle';

import { CodexCardCreation } from './CodexCardCreation';
import { CodexCardEditing } from './CodexCardEditing';
import { CodexCardGrid } from './CodexCardGrid';
import { useFactionFilter } from './useFactionFilter';

import styles from './CodexCardPage.module.scss';

export function CodexCardPage() {
  const { universeId } = useParams<{ universeId: string }>();
  const { data: universe } = useUniverse(universeId!);
  const { data: cards = [], error } = useCards(universeId!);
  const { data: factions = [], isLoading: factionsLoading } = useFactions(
    universeId!,
  );
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<CardDto | null>(null);
  const [factionFilter, setFactionFilter] = useFactionFilter(
    factions,
    factionsLoading,
  );

  const visibleCards = useMemo(() => {
    const filtered = cards.filter((card) => {
      if (!factionFilter) return true;
      return card.factions?.includes(factionFilter) ?? false;
    });
    return filtered.sort((a, b) => {
      const costDiff = totalCost(a.cost) - totalCost(b.cost);
      if (costDiff !== 0) return costDiff;
      return a.name.localeCompare(b.name);
    });
  }, [cards, factionFilter]);

  return (
    <>
      <Page
        nav={<UniverseNav universeId={universeId!} />}
        header={
          <PageHeader
            title="Cards"
            breadcrumbs={[
              { label: 'Universes', to: '/universe' },
              {
                label: universe?.name ?? '…',
                to: `/universe/${universeId}`,
              },
            ]}
            toolbar={
              factions.length > 0 ? (
                <div className={styles.factionChips}>
                  {factions.map((faction) => (
                    <PillToggle
                      key={faction.id}
                      selected={factionFilter === faction.id}
                      onToggle={() => setFactionFilter(faction.id)}
                    >
                      {faction.name}
                    </PillToggle>
                  ))}
                </div>
              ) : undefined
            }
            action={
              <Button onClick={() => setCreateOpen(true)}>New Card</Button>
            }
          />
        }
      >
        <ErrorText message={error?.message} />
        <CodexCardGrid
          cards={visibleCards}
          totalCount={cards.length}
          onEdit={setEditTarget}
        />
      </Page>

      <CodexCardCreation
        open={createOpen}
        universeId={universeId!}
        defaultFaction={factionFilter || undefined}
        onClose={() => setCreateOpen(false)}
      />

      <CodexCardEditing
        key={editTarget?.id ?? ''}
        card={editTarget}
        universeId={universeId!}
        onClose={() => setEditTarget(null)}
      />
    </>
  );
}

function totalCost(cost: Record<string, number> = {}): number {
  let sum = 0;

  for (const value of Object.values(cost)) {
    sum += value;
  }

  return sum;
}
