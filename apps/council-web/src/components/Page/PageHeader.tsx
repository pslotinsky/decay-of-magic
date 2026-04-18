import type { ReactNode } from 'react';

import { Breadcrumbs, type Breadcrumb } from '../Breadcrumbs';
import styles from './Page.module.scss';

interface Props {
  title?: string;
  breadcrumbs?: Breadcrumb[];
  action?: ReactNode;
}

export const PageHeader = ({ title, breadcrumbs, action }: Props) => {
  return (
    <div className={styles.header}>
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumbs items={breadcrumbs} />
        )}
        {title && <h1 className={styles.heading}>{title}</h1>}
      </div>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
};
