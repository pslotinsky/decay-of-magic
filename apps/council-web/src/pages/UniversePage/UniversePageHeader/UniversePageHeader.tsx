import { type UniverseDto } from '@/api/universe';
import { Breadcrumbs } from '@/components/Breadcrumbs';

import styles from './UniversePageHeader.module.scss';

interface Props {
  universe: UniverseDto;
}

export function UniversePageHeader({ universe }: Props) {
  return (
    <div className={styles.hero}>
      {universe.cover && (
        <img
          className={styles.heroImage}
          src={universe.cover}
          alt={universe.name}
        />
      )}
      <div className={styles.heroOverlay}>
        <Breadcrumbs
          items={[
            { label: 'Home', to: '/' },
            { label: 'Universes', to: '/universe' },
          ]}
        />
        <div className={styles.heroBottom}>
          <h1 className={styles.heroTitle}>{universe.name}</h1>
          {universe.description && (
            <p className={styles.heroDescription}>{universe.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
