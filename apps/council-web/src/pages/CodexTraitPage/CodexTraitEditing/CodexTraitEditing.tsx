import { type SyntheticEvent, useState } from 'react';

import {
  APPLIES_TO_VALUES,
  type AppliesTo,
  type TraitDto,
} from '@dod/api-contract';

import { useUpdateTrait } from '@/api/codex';
import { Button } from '@/components/Button';
import { Drawer } from '@/components/Drawer';
import { ErrorText } from '@/components/ErrorText';
import { Form, FormField } from '@/components/Form';
import { PillToggleList } from '@/components/PillToggleList';
import { Text } from '@/components/Text';

interface Props {
  trait: TraitDto | null;
  onClose: () => void;
}

const FORM_ID = 'codex-trait-edit';

export function CodexTraitEditing({ trait, onClose }: Props) {
  const [name, setName] = useState(trait?.name ?? '');
  const [appliesTo, setAppliesTo] = useState<AppliesTo>(trait?.appliesTo ?? []);
  const { mutate, error, isPending } = useUpdateTrait();

  function toggle(value: AppliesTo[number]) {
    setAppliesTo((current) =>
      current.includes(value)
        ? current.filter((entry) => entry !== value)
        : [...current, value],
    );
  }

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (trait) {
      mutate({ id: trait.id, name, appliesTo }, { onSuccess: onClose });
    }
  }

  return (
    <Drawer
      open={!!trait}
      title="Edit Trait"
      subtitle={<Text mono muted value={trait?.id} />}
      onClose={onClose}
      footer={
        <>
          <ErrorText message={error?.message} />
          <Button
            type="submit"
            form={FORM_ID}
            disabled={isPending || appliesTo.length === 0}
          >
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
