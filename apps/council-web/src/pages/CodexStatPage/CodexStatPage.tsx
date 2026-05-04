import { useState } from 'react';
import { useParams } from 'react-router';

import type { StatDto } from '@dod/api-contract';

import { useStats } from '@/api/codex';
import { useUniverse } from '@/api/universe';
import { Button } from '@/components/Button';
import { ErrorText } from '@/components/ErrorText';
import { UniverseNav } from '@/components/NavMenu';
import { Page, PageHeader } from '@/components/Page';

import { CodexStatCreation } from './CodexStatCreation';
import { CodexStatEditing } from './CodexStatEditing';
import { CodexStatTable } from './CodexStatTable';

export function CodexStatPage() {
  const { universeId } = useParams<{ universeId: string }>();
  const { data: universe } = useUniverse(universeId!);
  const { data: stats = [], error } = useStats(universeId!);
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<StatDto | null>(null);

  return (
    <>
      <Page
        nav={<UniverseNav universeId={universeId!} />}
        header={
          <PageHeader
            title="Stats"
            breadcrumbs={[
              { label: 'Universes', to: '/universe' },
              {
                label: universe?.name ?? '…',
                to: `/universe/${universeId}`,
              },
            ]}
            action={
              <Button onClick={() => setCreateOpen(true)}>New Stat</Button>
            }
          />
        }
      >
        <ErrorText message={error?.message} />
        <CodexStatTable stats={stats} onEdit={setEditTarget} />
      </Page>

      <CodexStatCreation
        open={createOpen}
        universeId={universeId!}
        onClose={() => setCreateOpen(false)}
      />

      <CodexStatEditing
        key={editTarget?.id ?? ''}
        stat={editTarget}
        onClose={() => setEditTarget(null)}
      />
    </>
  );
}
