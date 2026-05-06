import { type SyntheticEvent, useState } from 'react';

import type { CitizenDto } from '@dod/api-contract';

import { useUpdateCitizen } from '@/api/citizen';
import { Button } from '@/components/Button';
import { Drawer } from '@/components/Drawer';
import { ErrorText } from '@/components/ErrorText';
import { Form, FormField } from '@/components/Form';
import { Text } from '@/components/Text';

interface Props {
  citizen: CitizenDto | null;
  onClose: () => void;
}

const FORM_ID = 'citizen-edit';

export function CitizensPageCitizenEditing({ citizen, onClose }: Props) {
  const [nickname, setNickname] = useState(citizen?.nickname ?? '');
  const { mutate, error, isPending } = useUpdateCitizen();

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    if (citizen) {
      mutate({ id: citizen.id, nickname }, { onSuccess: onClose });
    }
  }

  return (
    <Drawer
      open={!!citizen}
      title="Edit Citizen"
      subtitle={<Text mono muted value={citizen?.id} />}
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
        <FormField label="Nickname">
          <input
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
            required
          />
        </FormField>
      </Form>
    </Drawer>
  );
}
