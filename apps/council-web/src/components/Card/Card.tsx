import { clsx } from 'clsx';
import type { ReactNode } from 'react';

import styles from './Card.module.scss';

interface Props {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  noPadding?: boolean;
  onClick?: () => void;
}

export function Card({
  children,
  className,
  interactive,
  noPadding,
  onClick,
}: Props) {
  return (
    <div
      className={clsx(
        styles.card,
        interactive && styles.interactive,
        noPadding && styles.noPadding,
        className,
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
