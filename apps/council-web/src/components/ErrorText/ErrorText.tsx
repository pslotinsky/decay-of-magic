import styles from './ErrorText.module.scss';

type Variant = 'field' | 'form';

interface Props {
  message?: string;
  variant?: Variant;
  className?: string;
}

export function ErrorText({ message, variant = 'form', className }: Props) {
  if (!message) return null;

  const composed = [variant === 'field' ? styles.field : styles.form, className]
    .filter(Boolean)
    .join(' ');

  if (variant === 'field') {
    return <span className={composed}>{message}</span>;
  }

  return <p className={composed}>{message}</p>;
}
