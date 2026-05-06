import { type SyntheticEvent, useState } from 'react';

import type { UniverseDto } from '@dod/api-contract';

import { useUpdateUniverse } from '@/api/universe';
import { Button } from '@/components/Button';
import { Drawer } from '@/components/Drawer';
import { ErrorText } from '@/components/ErrorText';
import { Form, FormField } from '@/components/Form';
import { ImageInput } from '@/components/ImageInput';
import { Text } from '@/components/Text';
import { Textarea } from '@/components/Textarea';

interface Props {
  universe: UniverseDto | null;
  onClose: () => void;
}

const FORM_ID = 'universe-edit';

export function UniversesPageUniverseEditing({ universe, onClose }: Props) {
  const [name, setName] = useState(universe?.name ?? '');
  const [description, setDescription] = useState(universe?.description ?? '');
  const [cover, setCover] = useState(universe?.cover ?? '');
  const { mutate, error, isPending } = useUpdateUniverse();

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    if (universe) {
      mutate(
        {
          id: universe.id,
          name,
          ...(description && { description }),
          ...(cover && { cover }),
        },
        { onSuccess: onClose },
      );
    }
  }

  return (
    <Drawer
      open={!!universe}
      title="Edit Universe"
      subtitle={<Text mono muted value={universe?.id} />}
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
        <FormField label="Description">
          <Textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Optional"
          />
        </FormField>
        <FormField label="Cover">
          <ImageInput value={cover} onChange={setCover} />
        </FormField>
      </Form>
    </Drawer>
  );
}
