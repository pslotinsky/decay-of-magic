import { type SyntheticEvent, useState } from 'react';

import type { ElementDto } from '@dod/api-contract';

import { useUpdateElement } from '@/api/codex';
import { useFieldErrors } from '@/api/error';
import { Button } from '@/components/Button';
import { Drawer } from '@/components/Drawer';
import { ErrorText } from '@/components/ErrorText';
import { Form, FormField } from '@/components/Form';
import { Text } from '@/components/Text';

interface Props {
  element: ElementDto | null;
  onClose: () => void;
}

const FORM_ID = 'codex-element-edit';

export function CodexElementEditing({ element, onClose }: Props) {
  const [name, setName] = useState(element?.name ?? '');
  const { mutate, error, isPending } = useUpdateElement();
  const fieldErrors = useFieldErrors(error);

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (element) {
      mutate({ id: element.id, name }, { onSuccess: onClose });
    }
  }

  return (
    <Drawer
      open={!!element}
      title="Edit Element"
      subtitle={<Text mono muted value={element?.id} />}
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
          <ErrorText message={fieldErrors.name} variant="field" />
        </FormField>
      </Form>
    </Drawer>
  );
}
