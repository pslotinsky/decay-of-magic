import { Globe, Pencil } from 'lucide-react';
import { useNavigate } from 'react-router';

import { Card } from '@/components/Card';
import { IconButton } from '@/components/IconButton';
import { type UniverseDto } from '@/queries/universe';

import styles from './UniversesPageList.module.scss';

interface Props {
  universes: UniverseDto[];
  loading: boolean;
  error: string | null;
  onEdit: (universe: UniverseDto) => void;
}

export function UniversesPageList({ universes, error, onEdit }: Props) {
  const navigate = useNavigate();

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  if (universes.length === 0) {
    return <p className={styles.muted}>No universes have been created.</p>;
  }

  return (
    <div className={styles.grid}>
      {universes.map((universe) => (
        <Card
          key={universe.id}
          interactive
          className={styles.card}
          onClick={() => void navigate(`/universe/${universe.id}`)}
        >
          {universe.cover ? (
            <img
              className={styles.cover}
              src={universe.cover}
              alt={universe.name}
            />
          ) : (
            <div className={styles.coverPlaceholder}>
              <Globe size={40} />
            </div>
          )}
          <div className={styles.body}>
            <div className={styles.header}>
              <div className={styles.name}>{universe.name}</div>
              <IconButton
                className={styles.edit}
                onClick={(event) => {
                  event.stopPropagation();
                  onEdit(universe);
                }}
              >
                <Pencil size={16} />
              </IconButton>
            </div>
            {universe.description && (
              <p className={styles.description}>{universe.description}</p>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
