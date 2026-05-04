import {
  useCards,
  useCreateCard,
  useElements,
  useFactions,
  useStats,
  useTraits,
} from '@/api/codex';
import { Button } from '@/components/Button';
import { Drawer } from '@/components/Drawer';
import { ErrorText } from '@/components/ErrorText';

import { CodexCardForm } from '../CodexCardForm';

interface Props {
  open: boolean;
  universeId: string;
  defaultFaction?: string;
  onClose: () => void;
}

const FORM_ID = 'codex-card-create';

export function CodexCardCreation({
  open,
  universeId,
  defaultFaction,
  onClose,
}: Props) {
  const { data: elements = [] } = useElements(universeId);
  const { data: factions = [] } = useFactions(universeId);
  const { data: stats = [] } = useStats(universeId);
  const { data: traits = [] } = useTraits(universeId);
  const { data: cards = [] } = useCards(universeId);
  const { mutate, error, isPending } = useCreateCard();

  const initial = defaultFaction ? { factions: [defaultFaction] } : undefined;

  return (
    <Drawer
      open={open}
      title="Create Card"
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
      <CodexCardForm
        formId={FORM_ID}
        initial={initial}
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
