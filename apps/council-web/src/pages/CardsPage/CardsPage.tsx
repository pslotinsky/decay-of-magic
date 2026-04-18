import { useEffect, useState } from 'react';

import styles from './CardsPage.module.scss';

import { CardPreview, type CardDto } from '@/components/CardPreview';
import { Page, PageHeader } from '@/components/Page';

export const CardsPage = () => {
  const [cards, setCards] = useState<CardDto[]>([]);

  useEffect(() => {
    fetch('/api/v1/card')
      .then((response) => response.json())
      .then(setCards);
  }, []);

  return (
    <Page
      header={
        <PageHeader title="Cards" breadcrumbs={[{ label: 'Home', to: '/' }]} />
      }
    >
      <div className={styles.grid}>
        {cards.map((card) => (
          <CardPreview key={card.id} {...card} />
        ))}
      </div>
    </Page>
  );
};
