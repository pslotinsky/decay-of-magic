import { type SyntheticEvent, useState } from 'react';

import { useCreateUniverse } from '@/api/universe';
import { Button } from '@/components/Button';
import { Drawer } from '@/components/Drawer';
import { ErrorText } from '@/components/ErrorText';
import { ImageInput } from '@/components/ImageInput';
import { Textarea } from '@/components/Textarea';

import styles from './UniversesPageUniverseCreation.module.scss';

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
  const { mutate, error, isPending } = useCreateUniverse();

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    mutate(
      {
        id,
        name,
        ...(description && { description }),
        ...(cover && { cover }),
      },
      {
        onSuccess: () => {
          setId('');
          setName('');
          setDescription('');
          setCover('');
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
          <ErrorText message={error?.message} />
          <Button type="submit" form={FORM_ID} disabled={isPending}>
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
            onChange={(event) => setId(event.target.value)}
            placeholder="e.g. arcane-dominion"
            required
          />
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Name</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Universe name"
            required
          />
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Description</span>
          <Textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Optional"
          />
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Cover</span>
          <ImageInput value={cover} onChange={setCover} />
        </div>
      </form>
    </Drawer>
  );
}
