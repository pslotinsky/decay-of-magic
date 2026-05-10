import { type SyntheticEvent, useState } from 'react';

import type { UniverseSettingsDto } from '@dod/api-contract';

import { useUniverse, useUpdateUniverse } from '@/api/universe';
import { Button } from '@/components/Button';
import { Drawer } from '@/components/Drawer';
import { ErrorText } from '@/components/ErrorText';
import { Form, FormField } from '@/components/Form';
import { ImageInput } from '@/components/ImageInput';
import { JsonEditor } from '@/components/JsonEditor';
import { Text } from '@/components/Text';
import { Textarea } from '@/components/Textarea';

interface Props {
  universeId: string | null;
  onClose: () => void;
}

const FORM_ID = 'universe-edit';

export function UniverseDrawer({ universeId, onClose }: Props) {
  const { data: universe, isPending } = useUniverse(universeId ?? '');
  const [editedName, setEditedName] = useState<string | null>(null);
  const [editedDescription, setEditedDescription] = useState<string | null>(
    null,
  );
  const [editedCover, setEditedCover] = useState<string | null>(null);
  const [editedSettings, setEditedSettings] =
    useState<UniverseSettingsDto | null>(null);
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const { mutate, error, isPending: isSaving } = useUpdateUniverse();

  const name = editedName ?? universe?.name ?? '';
  const description = editedDescription ?? universe?.description ?? '';
  const cover = editedCover ?? universe?.cover ?? '';

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!universe || settingsError !== null) {
      return;
    }
    mutate(
      {
        id: universe.id,
        name,
        ...(description && { description }),
        ...(cover && { cover }),
        settings: editedSettings ?? universe.settings,
      },
      { onSuccess: onClose },
    );
  }

  const open = universeId !== null;
  const ready = universe !== undefined;

  return (
    <Drawer
      open={open}
      title="Edit Universe"
      subtitle={<Text mono muted value={universe?.id} />}
      onClose={onClose}
      footer={
        <>
          <ErrorText message={settingsError ?? error?.message} />
          <Button
            type="submit"
            form={FORM_ID}
            disabled={!ready || isSaving || isPending}
          >
            {isSaving ? 'Saving…' : 'Save'}
          </Button>
        </>
      }
    >
      {ready ? (
        <Form id={FORM_ID} onSubmit={handleSubmit}>
          <FormField label="Name">
            <input
              value={name}
              onChange={(event) => setEditedName(event.target.value)}
              required
            />
          </FormField>
          <FormField label="Description">
            <Textarea
              value={description}
              onChange={(event) => setEditedDescription(event.target.value)}
              placeholder="Optional"
            />
          </FormField>
          <FormField label="Cover">
            <ImageInput value={cover} onChange={setEditedCover} />
          </FormField>
          <FormField label="Settings (JSON)">
            <JsonEditor
              defaultValue={universe.settings}
              onChange={setEditedSettings}
              onError={setSettingsError}
            />
          </FormField>
        </Form>
      ) : null}
    </Drawer>
  );
}
