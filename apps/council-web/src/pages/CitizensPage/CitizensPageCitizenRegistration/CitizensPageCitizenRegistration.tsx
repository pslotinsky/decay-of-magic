import { type SyntheticEvent, useState } from 'react';

import { useRegisterCitizen } from '@/api/citizen';
import { Button } from '@/components/Button';
import { Drawer } from '@/components/Drawer';
import { ErrorText } from '@/components/ErrorText';
import { Form, FormField } from '@/components/Form';

interface Props {
  open: boolean;
  onClose: () => void;
}

const FORM_ID = 'citizen-register';

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
    <Drawer
      open={open}
      title="Enroll Citizen"
      onClose={onClose}
      footer={
        <>
          <ErrorText message={error?.message} />
          <Button type="submit" form={FORM_ID} disabled={isPending}>
            {isPending ? 'Enrolling…' : 'Enroll'}
          </Button>
        </>
      }
    >
      <Form id={FORM_ID} onSubmit={handleSubmit}>
        <FormField label="Nickname">
          <input
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
            placeholder="Choose a name"
            required
          />
        </FormField>
        <FormField label="Secret">
          <input
            type="password"
            value={secret}
            onChange={(event) => setSecret(event.target.value)}
            placeholder="At least 8 characters"
            minLength={8}
            required
          />
        </FormField>
      </Form>
    </Drawer>
  );
}
