import { Pencil } from 'lucide-react';

import type { TraitDto } from '@dod/api-contract';

import { Card } from '@/components/Card';
import { IconButton } from '@/components/IconButton';

import styles from './CodexTraitTable.module.scss';

interface Props {
  traits: TraitDto[];
  onEdit: (trait: TraitDto) => void;
}

export function CodexTraitTable({ traits, onEdit }: Props) {
  if (traits.length === 0) {
    return <p className={styles.empty}>No traits yet.</p>;
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
          {traits.map((trait) => (
            <tr
              key={trait.id}
              className={styles.row}
              onClick={() => onEdit(trait)}
            >
              <td className={styles.code}>{trait.id}</td>
              <td>{trait.name}</td>
              <td className={styles.muted}>{trait.appliesTo.join(', ')}</td>
              <td className={styles.actions}>
                <IconButton
                  onClick={(event) => {
                    event.stopPropagation();
                    onEdit(trait);
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
