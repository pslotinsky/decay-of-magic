import { useState } from 'react';
import { useParams } from 'react-router';

import type { TraitDto } from '@dod/api-contract';

import { useTraits } from '@/api/codex';
import { useUniverse } from '@/api/universe';
import { Button } from '@/components/Button';
import { ErrorText } from '@/components/ErrorText';
import { UniverseNav } from '@/components/NavMenu';
import { Page, PageHeader } from '@/components/Page';

import { CodexTraitCreation } from './CodexTraitCreation';
import { CodexTraitEditing } from './CodexTraitEditing';
import { CodexTraitTable } from './CodexTraitTable';

export function CodexTraitPage() {
  const { universeId } = useParams<{ universeId: string }>();
  const { data: universe } = useUniverse(universeId!);
  const { data: traits = [], error } = useTraits(universeId!);
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<TraitDto | null>(null);

  return (
    <>
      <Page
        nav={<UniverseNav universeId={universeId!} />}
        header={
          <PageHeader
            title="Traits"
            breadcrumbs={[
              { label: 'Universes', to: '/universe' },
              {
                label: universe?.name ?? '…',
                to: `/universe/${universeId}`,
              },
            ]}
            action={
              <Button onClick={() => setCreateOpen(true)}>New Trait</Button>
            }
          />
        }
      >
        <ErrorText message={error?.message} />
        <CodexTraitTable traits={traits} onEdit={setEditTarget} />
      </Page>

      <CodexTraitCreation
        open={createOpen}
        universeId={universeId!}
        onClose={() => setCreateOpen(false)}
      />

      <CodexTraitEditing
        key={editTarget?.id ?? ''}
        trait={editTarget}
        onClose={() => setEditTarget(null)}
      />
    </>
  );
}
