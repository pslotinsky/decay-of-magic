import { clsx } from 'clsx';
import type { ReactNode } from 'react';

import styles from './Table.module.scss';

export interface TableColumn<T> {
  header: ReactNode;
  cell: (row: T) => ReactNode;
}

interface Props<T extends { id: string }> {
  rows: readonly T[];
  columns: TableColumn<T>[];
  onRowClick?: (row: T) => void;
  empty?: ReactNode;
}

export function Table<T extends { id: string }>({
  rows,
  columns,
  onRowClick,
  empty = 'No data',
}: Props<T>) {
  if (rows.length === 0) {
    return <p className={styles.empty}>{empty}</p>;
  }

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th key={index}>{column.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr
            key={row.id}
            className={clsx(onRowClick && styles.rowClickable)}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
          >
            {columns.map((column, index) => (
              <td key={index}>{column.cell(row)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
