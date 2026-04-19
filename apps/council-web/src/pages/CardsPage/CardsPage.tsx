import { useCards } from '@/api/card';
import { CardPreview } from '@/components/CardPreview';
import { Page, PageHeader } from '@/components/Page';

import styles from './CardsPage.module.scss';

export const CardsPage = () => {
  const { data: cards } = useCards();

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
