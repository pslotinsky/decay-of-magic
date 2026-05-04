import { type SyntheticEvent, useState } from 'react';

import { APPLIES_TO_VALUES, type AppliesTo } from '@dod/api-contract';

import { useCreateTrait } from '@/api/codex';
import { Button } from '@/components/Button';
import { Drawer } from '@/components/Drawer';
import { ErrorText } from '@/components/ErrorText';
import { PillToggle } from '@/components/PillToggle';
import { nameToSlug } from '@/util/slug';

import styles from './CodexTraitCreation.module.scss';

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
      <form id={FORM_ID} onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <span className={styles.label}>Id</span>
          <input
            value={id}
            onChange={(event) => handleIdChange(event.target.value)}
            placeholder="e.g. immuneToSpells"
            required
          />
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Name</span>
          <input
            value={name}
            onChange={(event) => handleNameChange(event.target.value)}
            placeholder="Display name"
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
