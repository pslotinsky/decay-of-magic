import { useState } from 'react';

import { useUniverses } from '@/api/universe';
import { Button } from '@/components/Button';
import { RootNav } from '@/components/NavMenu';
import { Page, PageHeader } from '@/components/Page';
import { UniverseDrawer } from '@/widgets/UniverseDrawer';

import { UniversesPageList } from './UniversesPageList';
import { UniversesPageUniverseCreation } from './UniversesPageUniverseCreation';

export function UniversesPage() {
  const { data: universes = [], isLoading, error } = useUniverses();
  const [createOpen, setCreateOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

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
          onEdit={setEditingId}
        />
      </Page>

      <UniversesPageUniverseCreation
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />

      <UniverseDrawer
        key={editingId ?? ''}
        universeId={editingId}
        onClose={() => setEditingId(null)}
      />
    </>
  );
}
