import { type ReactNode, useMemo } from 'react';
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import type { TableColumn } from '@/components/Table';
import tableStyles from '@/components/Table/Table.module.scss';

import { SortableRow } from './SortableRow';
import type { Orderable } from './types';

import styles from './SortableTable.module.scss';

interface Props<T extends Orderable> {
  rows: readonly T[];
  columns: TableColumn<T>[];
  onRowClick?: (row: T) => void;
  onSetOrder: (id: string, order: number) => void;
  empty?: ReactNode;
}

export function SortableTable<T extends Orderable>({
  rows,
  columns,
  onRowClick,
  onSetOrder,
  empty = 'No data',
}: Props<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
  );

  const sorted = useMemo(() => {
    return [...rows].sort((a, b) => {
      const aOrder = a.order ?? Number.POSITIVE_INFINITY;
      const bOrder = b.order ?? Number.POSITIVE_INFINITY;
      if (aOrder !== bOrder) {
        return aOrder - bOrder;
      }
      return a.name.localeCompare(b.name);
    });
  }, [rows]);

  if (sorted.length === 0) {
    return <p className={tableStyles.empty}>{empty}</p>;
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }
    const oldIndex = sorted.findIndex((row) => row.id === active.id);
    const newIndex = sorted.findIndex((row) => row.id === over.id);
    if (oldIndex === -1 || newIndex === -1) {
      return;
    }
    const reordered = arrayMove(sorted.slice(), oldIndex, newIndex);
    reordered.forEach((row, index) => {
      if (row.order !== index) {
        onSetOrder(row.id, index);
      }
    });
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={sorted.map((row) => row.id)}
        strategy={verticalListSortingStrategy}
      >
        <table className={tableStyles.table}>
          <thead>
            <tr>
              <th className={styles.handleCol} />
              {columns.map((column, index) => (
                <th key={index}>{column.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => (
              <SortableRow
                key={row.id}
                row={row}
                columns={columns}
                onRowClick={onRowClick}
              />
            ))}
          </tbody>
        </table>
      </SortableContext>
    </DndContext>
  );
}
