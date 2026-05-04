import { Pencil } from 'lucide-react';

import type { HeroDto } from '@dod/api-contract';

import { Card } from '@/components/Card';
import { IconButton } from '@/components/IconButton';

import styles from './CodexHeroTable.module.scss';

interface Props {
  heroes: HeroDto[];
  onEdit: (hero: HeroDto) => void;
}

export function CodexHeroTable({ heroes, onEdit }: Props) {
  if (heroes.length === 0) {
    return <p className={styles.empty}>No heroes yet.</p>;
  }

  return (
    <Card noPadding>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Faction</th>
            <th>Elements</th>
            <th aria-label="actions" />
          </tr>
        </thead>
        <tbody>
          {heroes.map((hero) => (
            <tr
              key={hero.id}
              className={styles.row}
              onClick={() => onEdit(hero)}
            >
              <td>{hero.name}</td>
              <td className={styles.muted}>{hero.faction ?? '—'}</td>
              <td className={styles.muted}>
                {summarizeElements(hero.elements)}
              </td>
              <td className={styles.actions}>
                <IconButton
                  onClick={(event) => {
                    event.stopPropagation();
                    onEdit(hero);
                  }}
                >
                  <Pencil size={16} />
                </IconButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function summarizeElements(elements: Record<string, number>): string {
  const entries = Object.entries(elements).filter(([, value]) => value > 0);
  if (entries.length === 0) return '—';
  return entries.map(([slug, value]) => `${slug}:${value}`).join(' ');
}
