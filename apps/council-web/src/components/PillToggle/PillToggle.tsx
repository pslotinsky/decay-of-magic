import type { ReactNode } from 'react';

import styles from './PillToggle.module.scss';

interface Props {
  selected: boolean;
  onToggle: () => void;
  disabled?: boolean;
  children: ReactNode;
}

export function PillToggle({ selected, onToggle, disabled, children }: Props) {
  return (
    <button
      type="button"
      className={`${styles.pill} ${selected ? styles.selected : ''}`}
      onClick={onToggle}
      disabled={disabled}
      aria-pressed={selected}
    >
      {children}
    </button>
  );
}
