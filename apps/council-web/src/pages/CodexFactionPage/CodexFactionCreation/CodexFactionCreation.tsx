import { type SyntheticEvent, useState } from 'react';

import { useCreateFaction, useElements } from '@/api/codex';
import { Button } from '@/components/Button';
import { Drawer } from '@/components/Drawer';
import { ErrorText } from '@/components/ErrorText';
import { Form, FormField } from '@/components/Form';
import { PillToggleList } from '@/components/PillToggleList';
import { nameToSlug } from '@/util/slug';

interface Props {
  open: boolean;
  universeId: string;
  onClose: () => void;
}

const FORM_ID = 'codex-faction-create';

export function CodexFactionCreation({ open, universeId, onClose }: Props) {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [idTouched, setIdTouched] = useState(false);
  const [elementIds, setElementIds] = useState<Set<string>>(new Set());
  const { data: elements = [] } = useElements(universeId);
  const { mutate, error, isPending } = useCreateFaction();

  function handleNameChange(value: string) {
    setName(value);
    if (!idTouched) setId(nameToSlug(value));
  }

  function handleIdChange(value: string) {
    setIdTouched(true);
    setId(value);
  }

  function toggleElement(elementId: string) {
    setElementIds((current) => {
      const next = new Set(current);
      if (next.has(elementId)) {
        next.delete(elementId);
      } else {
        next.add(elementId);
      }
      return next;
    });
  }

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    mutate(
      { id, universeId, name, elements: [...elementIds] },
      {
        onSuccess: () => {
          setId('');
          setName('');
          setIdTouched(false);
          setElementIds(new Set());
          onClose();
        },
      },
    );
  }

  return (
    <Drawer
      open={open}
      title="Create Faction"
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
      <Form id={FORM_ID} onSubmit={handleSubmit}>
        <FormField label="Name">
          <input
            value={name}
            onChange={(event) => handleNameChange(event.target.value)}
            placeholder="Display name"
            required
          />
        </FormField>
        <FormField label="Id">
          <input
            value={id}
            onChange={(event) => handleIdChange(event.target.value)}
            placeholder="e.g. orderOfAsh"
            required
          />
        </FormField>
        {elements.length > 0 && (
          <FormField label="Elements">
            <PillToggleList
              items={elements}
              isSelected={(element) => elementIds.has(element.id)}
              onToggle={(element) => toggleElement(element.id)}
              keyOf={(element) => element.id}
              labelOf={(element) => element.name}
            />
          </FormField>
        )}
      </Form>
    </Drawer>
  );
}
