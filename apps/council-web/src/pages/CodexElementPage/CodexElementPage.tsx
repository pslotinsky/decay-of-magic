import { useState } from 'react';
import { useParams } from 'react-router';

import type { ElementDto } from '@dod/api-contract';

import { useElements } from '@/api/codex';
import { useUniverse } from '@/api/universe';
import { Button } from '@/components/Button';
import { ErrorText } from '@/components/ErrorText';
import { UniverseNav } from '@/components/NavMenu';
import { Page, PageHeader } from '@/components/Page';

import { CodexElementCreation } from './CodexElementCreation';
import { CodexElementEditing } from './CodexElementEditing';
import { CodexElementTable } from './CodexElementTable';

export function CodexElementPage() {
  const { universeId } = useParams<{ universeId: string }>();
  const { data: universe } = useUniverse(universeId!);
  const { data: elements = [], error } = useElements(universeId!);
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ElementDto | null>(null);

  return (
    <>
      <Page
        nav={<UniverseNav universeId={universeId!} />}
        header={
          <PageHeader
            title="Elements"
            breadcrumbs={[
              { label: 'Universes', to: '/universe' },
              {
                label: universe?.name ?? '…',
                to: `/universe/${universeId}`,
              },
            ]}
            action={
              <Button onClick={() => setCreateOpen(true)}>New Element</Button>
            }
          />
        }
      >
        <ErrorText message={error?.message} />
        <CodexElementTable elements={elements} onEdit={setEditTarget} />
      </Page>

      <CodexElementCreation
        open={createOpen}
        universeId={universeId!}
        onClose={() => setCreateOpen(false)}
      />

      <CodexElementEditing
        key={editTarget?.id ?? ''}
        element={editTarget}
        onClose={() => setEditTarget(null)}
      />
    </>
  );
}
