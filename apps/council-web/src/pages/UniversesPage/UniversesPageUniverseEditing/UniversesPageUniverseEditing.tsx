import { type SyntheticEvent, useState } from 'react';

import { Button } from '@/components/Button';
import { Drawer } from '@/components/Drawer';
import { ImageInput } from '@/components/ImageInput';
import { Textarea } from '@/components/Textarea';
import { type UniverseDto, useUpdateUniverse } from '@/queries/universe';

import styles from './UniversesPageUniverseEditing.module.scss';

interface Props {
  universe: UniverseDto | null;
  onClose: () => void;
}

export function UniversesPageUniverseEditing({ universe, onClose }: Props) {
  const [name, setName] = useState(universe?.name ?? '');
  const [description, setDescription] = useState(universe?.description ?? '');
  const [cover, setCover] = useState(universe?.cover ?? '');
  const { mutate, error, isPending } = useUpdateUniverse();

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    if (universe) {
      mutate(
        {
          id: universe.id,
          name,
          ...(description && { description }),
          ...(cover && { cover }),
        },
        { onSuccess: onClose },
      );
    }
  }

  return (
    <Drawer open={!!universe} title="Edit Universe" onClose={onClose}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <span className={styles.label}>Name</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
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
        {error && <p className={styles.error}>{error.message}</p>}
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving…' : 'Save'}
        </Button>
      </form>
    </Drawer>
  );
}
