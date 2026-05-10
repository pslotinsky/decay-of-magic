import type { CardDto } from '@dod/api-contract';

import { CodexCardItem } from './CodexCardItem';

import styles from './CodexCardGrid.module.scss';

interface Props {
  cards: CardDto[];
  totalCount: number;
  onEdit: (card: CardDto) => void;
}

export function CodexCardGrid({ cards, totalCount, onEdit }: Props) {
  if (cards.length === 0) {
    return (
      <p className={styles.empty}>
        {totalCount === 0 ? 'No cards yet.' : 'No cards match the filters.'}
      </p>
    );
  }

  return (
    <div className={styles.grid}>
      {cards.map((card) => (
        <CodexCardItem key={card.id} card={card} onEdit={onEdit} />
      ))}
    </div>
  );
}
