import { useState } from 'react';
import { useParams } from 'react-router';

import type { FactionDto } from '@dod/api-contract';

import { useFactions } from '@/api/codex';
import { useUniverse } from '@/api/universe';
import { Button } from '@/components/Button';
import { ErrorText } from '@/components/ErrorText';
import { UniverseNav } from '@/components/NavMenu';
import { Page, PageHeader } from '@/components/Page';

import { CodexFactionCreation } from './CodexFactionCreation';
import { CodexFactionEditing } from './CodexFactionEditing';
import { CodexFactionTable } from './CodexFactionTable';

export function CodexFactionPage() {
  const { universeId } = useParams<{ universeId: string }>();
  const { data: universe } = useUniverse(universeId!);
  const { data: factions = [], error } = useFactions(universeId!);
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<FactionDto | null>(null);

  return (
    <>
      <Page
        nav={<UniverseNav universeId={universeId!} />}
        header={
          <PageHeader
            title="Factions"
            breadcrumbs={[
              { label: 'Universes', to: '/universe' },
              {
                label: universe?.name ?? '…',
                to: `/universe/${universeId}`,
              },
            ]}
            action={
              <Button onClick={() => setCreateOpen(true)}>New Faction</Button>
            }
          />
        }
      >
        <ErrorText message={error?.message} />
        <CodexFactionTable factions={factions} onEdit={setEditTarget} />
      </Page>

      <CodexFactionCreation
        open={createOpen}
        universeId={universeId!}
        onClose={() => setCreateOpen(false)}
      />

      <CodexFactionEditing
        key={editTarget?.id ?? ''}
        faction={editTarget}
        onClose={() => setEditTarget(null)}
      />
    </>
  );
}
