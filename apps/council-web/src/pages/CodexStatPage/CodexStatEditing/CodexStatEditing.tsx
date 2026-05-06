import { type SyntheticEvent, useState } from 'react';

import {
  APPLIES_TO_VALUES,
  type AppliesTo,
  type StatDto,
} from '@dod/api-contract';

import { useUpdateStat } from '@/api/codex';
import { Button } from '@/components/Button';
import { Drawer } from '@/components/Drawer';
import { ErrorText } from '@/components/ErrorText';
import { Form, FormField } from '@/components/Form';
import { PillToggleList } from '@/components/PillToggleList';
import { Text } from '@/components/Text';

interface Props {
  stat: StatDto | null;
  onClose: () => void;
}

const FORM_ID = 'codex-stat-edit';

export function CodexStatEditing({ stat, onClose }: Props) {
  const [name, setName] = useState(stat?.name ?? '');
  const [appliesTo, setAppliesTo] = useState<AppliesTo>(stat?.appliesTo ?? []);
  const { mutate, error, isPending } = useUpdateStat();

  function toggle(value: AppliesTo[number]) {
    setAppliesTo((current) =>
      current.includes(value)
        ? current.filter((entry) => entry !== value)
        : [...current, value],
    );
  }

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (stat) {
      mutate({ id: stat.id, name, appliesTo }, { onSuccess: onClose });
    }
  }

  return (
    <Drawer
      open={!!stat}
      title="Edit Stat"
      subtitle={<Text mono muted value={stat?.id} />}
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
