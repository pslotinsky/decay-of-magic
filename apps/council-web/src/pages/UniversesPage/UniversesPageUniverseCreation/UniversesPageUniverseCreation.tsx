import { type SyntheticEvent, useState } from 'react';

import { DEFAULT_UNIVERSE_SETTINGS } from '@dod/api-contract';

import { useCreateUniverse } from '@/api/universe';
import { Button } from '@/components/Button';
import { Drawer } from '@/components/Drawer';
import { ErrorText } from '@/components/ErrorText';
import { Form, FormField } from '@/components/Form';
import { ImageInput } from '@/components/ImageInput';
import { JsonEditor } from '@/components/JsonEditor';
import { Textarea } from '@/components/Textarea';

interface Props {
  open: boolean;
  onClose: () => void;
}

const FORM_ID = 'universe-create';

export function UniversesPageUniverseCreation({ open, onClose }: Props) {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [cover, setCover] = useState('');
  const [settings, setSettings] = useState(DEFAULT_UNIVERSE_SETTINGS);
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const { mutate, error, isPending } = useCreateUniverse();

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (settingsError !== null) {
      return;
    }
    mutate(
      {
        id,
        name,
        ...(description && { description }),
        ...(cover && { cover }),
        settings,
      },
      {
        onSuccess: () => {
          setId('');
          setName('');
          setDescription('');
          setCover('');
          setSettings(DEFAULT_UNIVERSE_SETTINGS);
          onClose();
        },
      },
    );
  }

  return (
    <Drawer
      open={open}
      title="Create Universe"
      onClose={onClose}
      footer={
        <>
          <ErrorText message={settingsError ?? error?.message} />
          <Button type="submit" form={FORM_ID} disabled={isPending}>
            {isPending ? 'Creating…' : 'Create'}
          </Button>
        </>
      }
    >
      <Form id={FORM_ID} onSubmit={handleSubmit}>
        <FormField label="Id">
          <input
            value={id}
            onChange={(event) => setId(event.target.value)}
            placeholder="e.g. arcane-dominion"
            required
          />
        </FormField>
        <FormField label="Name">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Universe name"
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
        <FormField label="Settings (JSON)">
          <JsonEditor
            defaultValue={DEFAULT_UNIVERSE_SETTINGS}
            onChange={setSettings}
            onError={setSettingsError}
          />
        </FormField>
      </Form>
    </Drawer>
  );
}
