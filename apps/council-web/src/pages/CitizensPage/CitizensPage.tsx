import { useState } from 'react';

import type { CitizenDto } from '@dod/api-contract';

import { useCitizens } from '@/api/citizen';
import { Button } from '@/components/Button';
import { RootNav } from '@/components/NavMenu';
import { Page, PageHeader } from '@/components/Page';

import { CitizensPageCitizenEditing } from './CitizensPageCitizenEditing';
import { CitizensPageCitizenRegistration } from './CitizensPageCitizenRegistration';
import { CitizensPageList } from './CitizensPageList';

export function CitizensPage() {
  const { data: citizens = [], isLoading, error } = useCitizens();
  const [enrollOpen, setEnrollOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<CitizenDto | null>(null);

  return (
    <>
      <Page
        nav={<RootNav />}
        header={
          <PageHeader
            title="Register of Citizens"
            action={
              <Button onClick={() => setEnrollOpen(true)}>
                Enroll Citizen
              </Button>
            }
          />
        }
      >
        <CitizensPageList
          citizens={citizens}
          loading={isLoading}
          error={error?.message ?? null}
          onEdit={setEditTarget}
        />
      </Page>

      <CitizensPageCitizenRegistration
        open={enrollOpen}
        onClose={() => setEnrollOpen(false)}
      />

      <CitizensPageCitizenEditing
        key={editTarget?.id ?? ''}
        citizen={editTarget}
        onClose={() => setEditTarget(null)}
      />
    </>
  );
}
