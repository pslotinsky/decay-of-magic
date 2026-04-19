import { useParams } from 'react-router';

import { useUniverse } from '@/api/universe';
import { Page } from '@/components/Page';

import { UniversePageHeader } from './UniversePageHeader';

import styles from './UniversePage.module.scss';

export function UniversePage() {
  const { id } = useParams<{ id: string }>();
  const { data: universe, isLoading, error } = useUniverse(id!);

  return (
    <Page>
      {universe && <UniversePageHeader universe={universe} />}
      {error && <p className={styles.error}>{error.message}</p>}
      {isLoading && !universe && null}
    </Page>
  );
}
