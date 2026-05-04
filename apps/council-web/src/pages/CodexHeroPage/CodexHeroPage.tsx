import { useState } from 'react';
import { useParams } from 'react-router';

import type { HeroDto } from '@dod/api-contract';

import { useHeroes } from '@/api/codex';
import { useUniverse } from '@/api/universe';
import { Button } from '@/components/Button';
import { ErrorText } from '@/components/ErrorText';
import { UniverseNav } from '@/components/NavMenu';
import { Page, PageHeader } from '@/components/Page';

import { CodexHeroCreation } from './CodexHeroCreation';
import { CodexHeroEditing } from './CodexHeroEditing';
import { CodexHeroTable } from './CodexHeroTable';

export function CodexHeroPage() {
  const { universeId } = useParams<{ universeId: string }>();
  const { data: universe } = useUniverse(universeId!);
  const { data: heroes = [], error } = useHeroes(universeId!);
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<HeroDto | null>(null);

  return (
    <>
      <Page
        nav={<UniverseNav universeId={universeId!} />}
        header={
          <PageHeader
            title="Heroes"
            breadcrumbs={[
              { label: 'Universes', to: '/universe' },
              {
                label: universe?.name ?? '…',
                to: `/universe/${universeId}`,
              },
            ]}
            action={
              <Button onClick={() => setCreateOpen(true)}>New Hero</Button>
            }
          />
        }
      >
        <ErrorText message={error?.message} />
        <CodexHeroTable heroes={heroes} onEdit={setEditTarget} />
      </Page>

      <CodexHeroCreation
        open={createOpen}
        universeId={universeId!}
        onClose={() => setCreateOpen(false)}
      />

      <CodexHeroEditing
        key={editTarget?.id ?? ''}
        hero={editTarget}
        universeId={universeId!}
        onClose={() => setEditTarget(null)}
      />
    </>
  );
}
