import { Link } from 'react-router';

import styles from './Breadcrumbs.module.scss';

export interface Breadcrumb {
  label: string;
  to?: string;
}

interface Props {
  items: Breadcrumb[];
}

export function Breadcrumbs({ items }: Props) {
  return (
    <nav className={styles.breadcrumbs}>
      {items.map((crumb, i) => (
        <span key={i} className={styles.crumb}>
          {i > 0 && <span className={styles.sep}>›</span>}
          {crumb.to ? (
            <Link to={crumb.to} className={styles.link}>
              {crumb.label}
            </Link>
          ) : (
            <span className={styles.text}>{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
