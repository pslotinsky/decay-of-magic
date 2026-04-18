import { type SyntheticEvent, useState } from 'react';

import { Button } from '@/components/Button';
import { Drawer } from '@/components/Drawer';
import { useRegisterCitizen } from '@/queries/citizen';

import styles from './CitizensPageCitizenRegistration.module.scss';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CitizensPageCitizenRegistration({ open, onClose }: Props) {
  const [nickname, setNickname] = useState('');
  const [secret, setSecret] = useState('');
  const { mutate, error, isPending } = useRegisterCitizen();

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    mutate(
      { nickname, secret },
      {
        onSuccess: () => {
          setNickname('');
          setSecret('');
          onClose();
        },
      },
    );
  }

  return (
    <Drawer open={open} title="Enroll Citizen" onClose={onClose}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <span className={styles.label}>Nickname</span>
          <input
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
            placeholder="Choose a name"
            required
          />
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Secret</span>
          <input
            type="password"
            value={secret}
            onChange={(event) => setSecret(event.target.value)}
            placeholder="At least 8 characters"
            minLength={8}
            required
          />
        </div>
        {error && <p className={styles.error}>{error.message}</p>}
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Enrolling…' : 'Enroll'}
        </Button>
      </form>
    </Drawer>
  );
}
