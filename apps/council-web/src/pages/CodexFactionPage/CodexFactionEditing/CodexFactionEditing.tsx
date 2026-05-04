import { type SyntheticEvent, useState } from 'react';

import type { FactionDto } from '@dod/api-contract';

import { useUpdateFaction } from '@/api/codex';
import { Button } from '@/components/Button';
import { Drawer } from '@/components/Drawer';
import { ErrorText } from '@/components/ErrorText';

import styles from './CodexFactionEditing.module.scss';

interface Props {
  faction: FactionDto | null;
  onClose: () => void;
}

const FORM_ID = 'codex-faction-edit';

export function CodexFactionEditing({ faction, onClose }: Props) {
  const [name, setName] = useState(faction?.name ?? '');
  const { mutate, error, isPending } = useUpdateFaction();

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (faction) {
      mutate({ id: faction.id, name }, { onSuccess: onClose });
    }
  }

  return (
    <Drawer
      open={!!faction}
      title="Edit Faction"
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
      <form id={FORM_ID} onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <span className={styles.label}>Id</span>
          <span className={styles.readonly}>{faction?.id ?? ''}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Name</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>
      </form>
    </Drawer>
  );
}
