import { type SyntheticEvent, useState } from 'react';

import type { FactionDto } from '@dod/api-contract';

import { useUpdateFaction } from '@/api/codex';
import { Button } from '@/components/Button';
import { Drawer } from '@/components/Drawer';
import { ErrorText } from '@/components/ErrorText';
import { Form, FormField } from '@/components/Form';
import { Text } from '@/components/Text';

interface Props {
  faction: FactionDto | null;
  onClose: () => void;
}

const FORM_ID = 'codex-faction-edit';

export function CodexFactionEditing({ faction, onClose }: Props) {
  const [name, setName] = useState(faction?.name ?? '');
  const { mutate, error, isPending } = useUpdateFaction();

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (faction) {
      mutate({ id: faction.id, name }, { onSuccess: onClose });
    }
  }

  return (
    <Drawer
      open={!!faction}
      title="Edit Faction"
      subtitle={<Text mono muted value={faction?.id} />}
      onClose={onClose}
      footer={
        <>
          <ErrorText message={error?.message} />
          <Button type="submit" form={FORM_ID} disabled={isPending}>
            {isPending ? 'Saving…' : 'Save'}
          </Button>
        </>
      }
    >
      <Form id={FORM_ID} onSubmit={handleSubmit}>
        <FormField label="Name">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </FormField>
      </Form>
    </Drawer>
  );
}
