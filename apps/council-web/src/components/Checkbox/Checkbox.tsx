import { clsx } from 'clsx';
import type { ChangeEvent, ReactNode } from 'react';

import styles from './Checkbox.module.scss';

interface Props {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  children?: ReactNode;
}

export function Checkbox({ checked, onChange, disabled, children }: Props) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.target.checked);
  }

  return (
    <label className={clsx(styles.wrapper, disabled && styles.disabled)}>
      <input
        type="checkbox"
        className={styles.input}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
      />
      <span className={styles.box} aria-hidden="true" />
      {children !== undefined && <span className={styles.text}>{children}</span>}
    </label>
  );
}
