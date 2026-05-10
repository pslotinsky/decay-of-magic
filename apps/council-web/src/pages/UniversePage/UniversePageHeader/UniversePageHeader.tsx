import { Settings } from 'lucide-react';

import type { UniverseDto } from '@dod/api-contract';

import { Breadcrumbs } from '@/components/Breadcrumbs';

import styles from './UniversePageHeader.module.scss';

interface Props {
  universe: UniverseDto;
  onOpenSettings: () => void;
}

export function UniversePageHeader({ universe, onOpenSettings }: Props) {
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
        <div className={styles.heroTop}>
          <Breadcrumbs items={[{ label: 'Universes', to: '/universe' }]} />
          <button
            type="button"
            className={styles.settingsButton}
            onClick={onOpenSettings}
            aria-label="Universe settings"
          >
            <Settings size={20} />
          </button>
        </div>
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
