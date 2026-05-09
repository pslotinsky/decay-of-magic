import { type SyntheticEvent, useState } from 'react';

import { APPLIES_TO_VALUES, type AppliesTo } from '@dod/api-contract';

import { useCreateTrait } from '@/api/codex';
import { Button } from '@/components/Button';
import { Drawer } from '@/components/Drawer';
import { ErrorText } from '@/components/ErrorText';
import { Form, FormField } from '@/components/Form';
import { PillToggleList } from '@/components/PillToggleList';
import { nameToSlug } from '@/util/slug';

interface Props {
  open: boolean;
  universeId: string;
  onClose: () => void;
}

const FORM_ID = 'codex-trait-create';

export function CodexTraitCreation({ open, universeId, onClose }: Props) {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [idTouched, setIdTouched] = useState(false);
  const [appliesTo, setAppliesTo] = useState<AppliesTo>([]);
  const { mutate, error, isPending } = useCreateTrait();

  function handleNameChange(value: string) {
    setName(value);
    if (!idTouched) setId(nameToSlug(value));
  }

  function handleIdChange(value: string) {
    setIdTouched(true);
    setId(value);
  }

  function toggle(value: AppliesTo[number]) {
    setAppliesTo((current) =>
      current.includes(value)
        ? current.filter((entry) => entry !== value)
        : [...current, value],
    );
  }

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    mutate(
      { id, universeId, name, appliesTo },
      {
        onSuccess: () => {
          setId('');
          setName('');
          setIdTouched(false);
          setAppliesTo([]);
          onClose();
        },
      },
    );
  }

  return (
    <Drawer
      open={open}
      title="Create Trait"
      onClose={onClose}
      footer={
        <>
          <ErrorText message={error?.message} />
          <Button
            type="submit"
            form={FORM_ID}
            disabled={isPending || appliesTo.length === 0}
          >
            {isPending ? 'Creating…' : 'Create'}
          </Button>
        </>
      }
    >
      <Form id={FORM_ID} onSubmit={handleSubmit}>
        <FormField label="Name">
          <input
            value={name}
            onChange={(event) => handleNameChange(event.target.value)}
            placeholder="Display name"
            required
          />
        </FormField>
        <FormField label="Id">
          <input
            value={id}
            onChange={(event) => handleIdChange(event.target.value)}
            placeholder="e.g. immuneToSpells"
            required
          />
        </FormField>
        <FormField label="Applies to">
          <PillToggleList
            items={APPLIES_TO_VALUES}
            isSelected={(value) => appliesTo.includes(value)}
            onToggle={toggle}
          />
        </FormField>
      </Form>
    </Drawer>
  );
}
