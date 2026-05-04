import { Pencil } from 'lucide-react';

import type { ElementDto } from '@dod/api-contract';

import { Card } from '@/components/Card';
import { IconButton } from '@/components/IconButton';

import styles from './CodexElementTable.module.scss';

interface Props {
  elements: ElementDto[];
  onEdit: (element: ElementDto) => void;
}

export function CodexElementTable({ elements, onEdit }: Props) {
  if (elements.length === 0) {
    return (
      <p className={styles.empty}>
        No elements yet. Create the first to start authoring this Universe.
      </p>
    );
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
          {elements.map((element) => (
            <tr
              key={element.id}
              className={styles.row}
              onClick={() => onEdit(element)}
            >
              <td className={styles.code}>{element.id}</td>
              <td>{element.name}</td>
              <td className={styles.actions}>
                <IconButton
                  onClick={(event) => {
                    event.stopPropagation();
                    onEdit(element);
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
