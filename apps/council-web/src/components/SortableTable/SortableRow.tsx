import { clsx } from 'clsx';
import { GripVertical } from 'lucide-react';
import type { CSSProperties } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import type { TableColumn } from '@/components/Table';
import tableStyles from '@/components/Table/Table.module.scss';

import type { Orderable } from './types';

import styles from './SortableTable.module.scss';

interface Props<T extends Orderable> {
  row: T;
  columns: TableColumn<T>[];
  onRowClick?: (row: T) => void;
}

export function SortableRow<T extends Orderable>({
  row,
  columns,
  onRowClick,
}: Props<T>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: row.id });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={clsx(onRowClick && tableStyles.rowClickable)}
      onClick={onRowClick ? () => onRowClick(row) : undefined}
    >
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: stopPropagation guard on drag-handle cell; not user-interactive */}
      <td
        className={styles.handleCell}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className={styles.handle}
          aria-label="Drag to reorder"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={16} />
        </button>
      </td>
      {columns.map((column, index) => (
        <td key={`${row.id}_${index}`}>{column.cell(row)}</td>
      ))}
    </tr>
  );
}
