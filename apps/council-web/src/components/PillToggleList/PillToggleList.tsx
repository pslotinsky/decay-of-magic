import { clsx } from 'clsx';
import type { ReactNode } from 'react';

import { PillToggle } from '@/components/PillToggle';

import styles from './PillToggleList.module.scss';

interface Props<T> {
  items: readonly T[];
  isSelected: (item: T) => boolean;
  onToggle: (item: T) => void;
  keyOf?: (item: T) => string;
  labelOf?: (item: T) => ReactNode;
  className?: string;
}

const defaultKey = (item: unknown) => String(item);
const defaultLabel = (item: unknown) => String(item);

export function PillToggleList<T>({
  items,
  isSelected,
  onToggle,
  keyOf = defaultKey,
  labelOf = defaultLabel,
  className,
}: Props<T>) {
  return (
    <div className={clsx(styles.row, className)}>
      {items.map((item) => (
        <PillToggle
          key={keyOf(item)}
          selected={isSelected(item)}
          onToggle={() => onToggle(item)}
        >
          {labelOf(item)}
        </PillToggle>
      ))}
    </div>
  );
}
