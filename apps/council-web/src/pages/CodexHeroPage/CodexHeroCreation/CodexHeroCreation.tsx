import {
  useCards,
  useCreateHero,
  useElements,
  useFactions,
  useStats,
  useTraits,
} from '@/api/codex';
import { Button } from '@/components/Button';
import { Drawer } from '@/components/Drawer';
import { ErrorText } from '@/components/ErrorText';

import { CodexHeroForm } from '../CodexHeroForm';

interface Props {
  open: boolean;
  universeId: string;
  onClose: () => void;
}

const FORM_ID = 'codex-hero-create';

export function CodexHeroCreation({ open, universeId, onClose }: Props) {
  const { data: elements = [] } = useElements(universeId);
  const { data: factions = [] } = useFactions(universeId);
  const { data: stats = [] } = useStats(universeId);
  const { data: traits = [] } = useTraits(universeId);
  const { data: cards = [] } = useCards(universeId);
  const { mutate, error, isPending } = useCreateHero();

  return (
    <Drawer
      open={open}
      title="Create Hero"
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
      <CodexHeroForm
        formId={FORM_ID}
        elements={elements}
        factions={factions}
        stats={stats}
        traits={traits}
        cards={cards}
        onSubmit={(payload) =>
          mutate({ ...payload, universeId }, { onSuccess: onClose })
        }
      />
    </Drawer>
  );
}
