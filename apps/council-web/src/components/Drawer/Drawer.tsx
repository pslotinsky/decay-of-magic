import { clsx } from 'clsx';
import type { ReactNode } from 'react';

import styles from './Drawer.module.scss';

interface Props {
  open: boolean;
  title: string;
  subtitle?: ReactNode;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

export function Drawer({
  open,
  title,
  subtitle,
  onClose,
  children,
  footer,
}: Props) {
  return (
    <>
      <div
        className={clsx(styles.overlay, open && styles.open)}
        onClick={onClose}
      />
      <div className={clsx(styles.drawer, open && styles.open)}>
        <div className={styles.header}>
          <div className={styles.titleGroup}>
            <h2 className={styles.title}>{title}</h2>
            {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
          </div>
          <button className={styles.close} onClick={onClose}>
            ✕
          </button>
        </div>
        <div className={styles.body}>{open && children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </>
  );
}
