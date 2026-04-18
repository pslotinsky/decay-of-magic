import { useState } from 'react';

import { useCitizens, type CitizenDto } from '@/queries/citizen';
import { Button } from '@/components/Button';
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
        header={
          <PageHeader
            title="Register of Citizens"
            breadcrumbs={[{ label: 'Home', to: '/' }]}
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
