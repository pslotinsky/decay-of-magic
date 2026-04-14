import type { ReactNode } from 'react';

import { Breadcrumbs, type Breadcrumb } from '../Breadcrumbs';
import { NavMenu } from '../NavMenu';
import styles from './Page.module.scss';

export type { Breadcrumb };

interface Props {
  title?: string;
  breadcrumbs?: Breadcrumb[];
  action?: ReactNode;
  children?: ReactNode;
}

export const Page = ({ title, breadcrumbs, action, children }: Props) => {
  return (
    <div className={styles.layout}>
      <NavMenu />
      <main className={styles.main}>
        <div className={styles.header}>
          <div>
            {breadcrumbs && breadcrumbs.length > 0 && (
              <Breadcrumbs items={breadcrumbs} />
            )}
            <h1 className={styles.heading}>{title}</h1>
          </div>
          {action && <div className={styles.action}>{action}</div>}
        </div>
        {children}
      </main>
    </div>
  );
};
