import { clsx } from 'clsx';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

import styles from './IconButton.module.scss';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

export function IconButton({ children, className, ...props }: Props) {
  return (
    <button type="button" className={clsx(styles.button, className)} {...props}>
      {children}
    </button>
  );
}
