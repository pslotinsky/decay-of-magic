import { type SyntheticEvent, useState } from 'react';

import type { FactionDto } from '@dod/api-contract';

import { useElements, useUpdateFaction } from '@/api/codex';
import { Button } from '@/components/Button';
import { Drawer } from '@/components/Drawer';
import { ErrorText } from '@/components/ErrorText';
import { Form, FormField } from '@/components/Form';
import { PillToggleList } from '@/components/PillToggleList';
import { Text } from '@/components/Text';

interface Props {
  faction: FactionDto | null;
  onClose: () => void;
}

const FORM_ID = 'codex-faction-edit';

export function CodexFactionEditing({ faction, onClose }: Props) {
  const [name, setName] = useState(faction?.name ?? '');
  const [elementIds, setElementIds] = useState<Set<string>>(
    new Set(faction?.elements ?? []),
  );
  const { data: elements = [] } = useElements(faction?.universeId ?? '');
  const { mutate, error, isPending } = useUpdateFaction();

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
    if (faction) {
      mutate(
        { id: faction.id, name, elements: [...elementIds] },
        { onSuccess: onClose },
      );
    }
  }

  return (
    <Drawer
      open={!!faction}
      title="Edit Faction"
      subtitle={<Text mono muted value={faction?.id} />}
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
      <Form id={FORM_ID} onSubmit={handleSubmit}>
        <FormField label="Name">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
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
