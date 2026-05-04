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
import { PillToggle } from '@/components/PillToggle';

import styles from './CodexStatEditing.module.scss';

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
      <form id={FORM_ID} onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <span className={styles.label}>Id</span>
          <span className={styles.readonly}>{stat?.id ?? ''}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Name</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Applies to</span>
          <div className={styles.pillRow}>
            {APPLIES_TO_VALUES.map((value) => (
              <PillToggle
                key={value}
                selected={appliesTo.includes(value)}
                onToggle={() => toggle(value)}
              >
                {value}
              </PillToggle>
            ))}
          </div>
        </div>
      </form>
    </Drawer>
  );
}
