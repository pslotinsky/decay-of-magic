import { useState } from 'react';

import type { UniverseDto } from '@dod/api-contract';

import { useUniverses } from '@/api/universe';
import { Button } from '@/components/Button';
import { RootNav } from '@/components/NavMenu';
import { Page, PageHeader } from '@/components/Page';

import { UniversesPageList } from './UniversesPageList';
import { UniversesPageUniverseCreation } from './UniversesPageUniverseCreation';
import { UniversesPageUniverseEditing } from './UniversesPageUniverseEditing';

export function UniversesPage() {
  const { data: universes = [], isLoading, error } = useUniverses();
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<UniverseDto | null>(null);

  return (
    <>
      <Page
        nav={<RootNav />}
        header={
          <PageHeader
            title="Universes"
            action={
              <Button onClick={() => setCreateOpen(true)}>
                Create Universe
              </Button>
            }
          />
        }
      >
        <UniversesPageList
          universes={universes}
          loading={isLoading}
          error={error?.message ?? null}
          onEdit={setEditTarget}
        />
      </Page>

      <UniversesPageUniverseCreation
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />

      <UniversesPageUniverseEditing
        key={editTarget?.id ?? ''}
        universe={editTarget}
        onClose={() => setEditTarget(null)}
      />
    </>
  );
}
