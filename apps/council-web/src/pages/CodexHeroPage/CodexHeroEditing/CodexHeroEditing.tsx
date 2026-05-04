import type { HeroDto } from '@dod/api-contract';

import {
  useCards,
  useElements,
  useFactions,
  useStats,
  useTraits,
  useUpdateHero,
} from '@/api/codex';
import { Button } from '@/components/Button';
import { Drawer } from '@/components/Drawer';
import { ErrorText } from '@/components/ErrorText';

import { CodexHeroForm } from '../CodexHeroForm';

interface Props {
  hero: HeroDto | null;
  universeId: string;
  onClose: () => void;
}

const FORM_ID = 'codex-hero-edit';

export function CodexHeroEditing({ hero, universeId, onClose }: Props) {
  const { data: elements = [] } = useElements(universeId);
  const { data: factions = [] } = useFactions(universeId);
  const { data: stats = [] } = useStats(universeId);
  const { data: traits = [] } = useTraits(universeId);
  const { data: cards = [] } = useCards(universeId);
  const { mutate, error, isPending } = useUpdateHero();

  return (
    <Drawer
      open={!!hero}
      title="Edit Hero"
      onClose={onClose}
      footer={
        hero ? (
          <>
            <ErrorText message={error?.message} />
            <Button type="submit" form={FORM_ID} disabled={isPending}>
              {isPending ? 'Saving…' : 'Save'}
            </Button>
          </>
        ) : undefined
      }
    >
      {hero && (
        <CodexHeroForm
          formId={FORM_ID}
          initial={hero}
          elements={elements}
          factions={factions}
          stats={stats}
          traits={traits}
          cards={cards}
          onSubmit={(payload) => mutate(payload, { onSuccess: onClose })}
        />
      )}
    </Drawer>
  );
}
