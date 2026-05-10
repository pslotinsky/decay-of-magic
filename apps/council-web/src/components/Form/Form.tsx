import { clsx } from 'clsx';
import type { ReactNode, SyntheticEvent } from 'react';

import styles from './Form.module.scss';

interface FormProps {
  id?: string;
  onSubmit?: (event: SyntheticEvent<HTMLFormElement>) => void;
  className?: string;
  children: ReactNode;
}

export function Form({ id, onSubmit, className, children }: FormProps) {
  return (
    <form id={id} onSubmit={onSubmit} className={clsx(styles.form, className)}>
      {children}
    </form>
  );
}

interface FormFieldProps {
  label: ReactNode;
  className?: string;
  children: ReactNode;
}

export function FormField({ label, className, children }: FormFieldProps) {
  return (
    <div className={clsx(styles.field, className)}>
      <span className={styles.label}>{label}</span>
      {children}
    </div>
  );
}
