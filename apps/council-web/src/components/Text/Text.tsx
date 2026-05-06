import { clsx } from 'clsx';
import type { ComponentPropsWithoutRef } from 'react';

import styles from './Text.module.scss';

interface Props extends Omit<ComponentPropsWithoutRef<'span'>, 'value'> {
  mono?: boolean;
  muted?: boolean;
  italic?: boolean;
  value?: string | null;
}

export function Text(props: Props) {
  const { mono, muted, italic, className, children, value, ...rest } = props;
  const hasValue = 'value' in props;

  if (hasValue && !value) return null;

  return (
    <span
      {...rest}
      className={clsx(
        mono && styles.mono,
        muted && styles.muted,
        italic && styles.italic,
        className,
      )}
    >
      {hasValue ? value : children}
    </span>
  );
}
