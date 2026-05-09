import { type SyntheticEvent, useState } from 'react';

import { APPLIES_TO_VALUES, type AppliesTo } from '@dod/api-contract';

import { useCreateStat } from '@/api/codex';
import { Button } from '@/components/Button';
import { Checkbox } from '@/components/Checkbox';
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

const FORM_ID = 'codex-stat-create';

export function CodexStatCreation({ open, universeId, onClose }: Props) {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [idTouched, setIdTouched] = useState(false);
  const [appliesTo, setAppliesTo] = useState<AppliesTo>([]);
  const [required, setRequired] = useState(false);
  const { mutate, error, isPending } = useCreateStat();

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
      { id, universeId, name, appliesTo, required },
      {
        onSuccess: () => {
          setId('');
          setName('');
          setIdTouched(false);
          setAppliesTo([]);
          setRequired(false);
          onClose();
        },
      },
    );
  }

  return (
    <Drawer
      open={open}
      title="Create Stat"
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
            placeholder="e.g. attack"
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
        <FormField label="Required">
          <Checkbox checked={required} onChange={setRequired}>
            Required by default
          </Checkbox>
        </FormField>
      </Form>
    </Drawer>
  );
}
