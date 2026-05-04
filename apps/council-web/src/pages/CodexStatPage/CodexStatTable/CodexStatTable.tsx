import { Pencil } from 'lucide-react';

import type { StatDto } from '@dod/api-contract';

import { Card } from '@/components/Card';
import { IconButton } from '@/components/IconButton';

import styles from './CodexStatTable.module.scss';

interface Props {
  stats: StatDto[];
  onEdit: (stat: StatDto) => void;
}

export function CodexStatTable({ stats, onEdit }: Props) {
  if (stats.length === 0) {
    return <p className={styles.empty}>No stats yet.</p>;
  }

  return (
    <Card noPadding>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Applies to</th>
            <th aria-label="actions" />
          </tr>
        </thead>
        <tbody>
          {stats.map((stat) => (
            <tr
              key={stat.id}
              className={styles.row}
              onClick={() => onEdit(stat)}
            >
              <td className={styles.code}>{stat.id}</td>
              <td>{stat.name}</td>
              <td className={styles.muted}>{stat.appliesTo.join(', ')}</td>
              <td className={styles.actions}>
                <IconButton
                  onClick={(event) => {
                    event.stopPropagation();
                    onEdit(stat);
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
