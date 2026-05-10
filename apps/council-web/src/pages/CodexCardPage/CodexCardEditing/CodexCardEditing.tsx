import { type CardDto, DEFAULT_CARD_ART } from '@dod/api-contract';

import {
  useCards,
  useElements,
  useFactions,
  useStats,
  useTraits,
  useUpdateCard,
} from '@/api/codex';
import { useUniverse } from '@/api/universe';
import { Button } from '@/components/Button';
import { Drawer } from '@/components/Drawer';
import { ErrorText } from '@/components/ErrorText';
import { Text } from '@/components/Text';

import { CodexCardForm } from '../CodexCardForm';

interface Props {
  card: CardDto | null;
  universeId: string;
  onClose: () => void;
}

const FORM_ID = 'codex-card-edit';

export function CodexCardEditing({ card, universeId, onClose }: Props) {
  const { data: universe } = useUniverse(universeId);
  const { data: elements = [] } = useElements(universeId);
  const { data: factions = [] } = useFactions(universeId);
  const { data: stats = [] } = useStats(universeId);
  const { data: traits = [] } = useTraits(universeId);
  const { data: cards = [] } = useCards(universeId);
  const { mutate, error, isPending } = useUpdateCard();
  const cardArt = universe?.settings.codex.cardArt ?? DEFAULT_CARD_ART;

  return (
    <Drawer
      open={!!card}
      title="Edit Card"
      subtitle={<Text mono muted value={card?.id} />}
      onClose={onClose}
      footer={
        card ? (
          <>
            <ErrorText message={error?.message} />
            <Button type="submit" form={FORM_ID} disabled={isPending}>
              {isPending ? 'Saving…' : 'Save'}
            </Button>
          </>
        ) : undefined
      }
    >
      {card && (
        <CodexCardForm
          formId={FORM_ID}
          initial={card}
          elements={elements}
          factions={factions}
          stats={stats}
          traits={traits}
          cards={cards}
          cardArt={cardArt}
          onSubmit={(payload) => mutate(payload, { onSuccess: onClose })}
        />
      )}
    </Drawer>
  );
}
