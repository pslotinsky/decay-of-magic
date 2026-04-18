import { type SyntheticEvent, useState } from 'react';

import { Button } from '@/components/Button';
import { Drawer } from '@/components/Drawer';
import { type CitizenDto, useUpdateCitizen } from '@/queries/citizen';

import styles from './CitizensPageCitizenEditing.module.scss';

interface Props {
  citizen: CitizenDto | null;
  onClose: () => void;
}

export function CitizensPageCitizenEditing({ citizen, onClose }: Props) {
  const [nickname, setNickname] = useState(citizen?.nickname ?? '');
  const { mutate, error, isPending } = useUpdateCitizen();

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    if (citizen) {
      mutate({ id: citizen.id, nickname }, { onSuccess: onClose });
    }
  }

  return (
    <Drawer open={!!citizen} title="Edit Citizen" onClose={onClose}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <span className={styles.label}>Nickname</span>
          <input
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
            required
          />
        </div>
        {error && <p className={styles.error}>{error.message}</p>}
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving…' : 'Save'}
        </Button>
      </form>
    </Drawer>
  );
}
