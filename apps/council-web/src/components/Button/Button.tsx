import type { ReactNode } from 'react';

import styles from './Button.module.scss';

export interface Props {
  children: ReactNode;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  onClick?: () => void;
}

export const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  disabled,
  onClick,
}: Props) => {
  return (
    <button
      type={type}
      className={variant === 'secondary' ? styles.secondary : styles.primary}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
