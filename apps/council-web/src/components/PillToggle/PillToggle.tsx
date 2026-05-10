import { clsx } from 'clsx';
import type { MouseEvent, ReactNode } from 'react';

import styles from './PillToggle.module.scss';

interface Props {
  selected: boolean;
  onToggle: (event: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  children: ReactNode;
}

export function PillToggle({ selected, onToggle, disabled, children }: Props) {
  return (
    <button
      type="button"
      className={clsx(styles.pill, selected && styles.selected)}
      onClick={onToggle}
      disabled={disabled}
      aria-pressed={selected}
    >
      {children}
    </button>
  );
}
