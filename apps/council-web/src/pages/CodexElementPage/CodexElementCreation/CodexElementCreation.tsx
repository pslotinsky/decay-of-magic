import { type SyntheticEvent, useState } from 'react';

import { useCreateElement } from '@/api/codex';
import { useFieldErrors } from '@/api/error';
import { Button } from '@/components/Button';
import { Drawer } from '@/components/Drawer';
import { ErrorText } from '@/components/ErrorText';
import { nameToSlug } from '@/util/slug';

import styles from './CodexElementCreation.module.scss';

interface Props {
  open: boolean;
  universeId: string;
  onClose: () => void;
}

const FORM_ID = 'codex-element-create';

export function CodexElementCreation({ open, universeId, onClose }: Props) {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [idTouched, setIdTouched] = useState(false);
  const { mutate, error, isPending } = useCreateElement();
  const fieldErrors = useFieldErrors(error);

  function handleNameChange(value: string) {
    setName(value);
    if (!idTouched) setId(nameToSlug(value));
  }

  function handleIdChange(value: string) {
    setIdTouched(true);
    setId(value);
  }

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    mutate(
      { id, universeId, name },
      {
        onSuccess: () => {
          setId('');
          setName('');
          setIdTouched(false);
          onClose();
        },
      },
    );
  }

  return (
    <Drawer
      open={open}
      title="Create Element"
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
            onChange={(event) => handleIdChange(event.target.value)}
            placeholder="e.g. fire"
            required
          />
          <ErrorText message={fieldErrors.id} variant="field" />
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Name</span>
          <input
            value={name}
            onChange={(event) => handleNameChange(event.target.value)}
            placeholder="Display name"
            required
          />
          <ErrorText message={fieldErrors.name} variant="field" />
        </div>
      </form>
    </Drawer>
  );
}
