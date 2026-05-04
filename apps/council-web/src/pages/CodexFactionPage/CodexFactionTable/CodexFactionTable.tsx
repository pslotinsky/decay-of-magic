import { Pencil } from 'lucide-react';

import type { FactionDto } from '@dod/api-contract';

import { Card } from '@/components/Card';
import { IconButton } from '@/components/IconButton';

import styles from './CodexFactionTable.module.scss';

interface Props {
  factions: FactionDto[];
  onEdit: (faction: FactionDto) => void;
}

export function CodexFactionTable({ factions, onEdit }: Props) {
  if (factions.length === 0) {
    return <p className={styles.empty}>No factions yet.</p>;
  }

  return (
    <Card noPadding>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th aria-label="actions" />
          </tr>
        </thead>
        <tbody>
          {factions.map((faction) => (
            <tr
              key={faction.id}
              className={styles.row}
              onClick={() => onEdit(faction)}
            >
              <td className={styles.code}>{faction.id}</td>
              <td>{faction.name}</td>
              <td className={styles.actions}>
                <IconButton
                  onClick={(event) => {
                    event.stopPropagation();
                    onEdit(faction);
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
