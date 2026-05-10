import type { ReactNode } from 'react';

import { type Breadcrumb, Breadcrumbs } from '../Breadcrumbs';

import styles from './Page.module.scss';

interface Props {
  title?: string;
  breadcrumbs?: Breadcrumb[];
  toolbar?: ReactNode;
  action?: ReactNode;
}

export const PageHeader = ({ title, breadcrumbs, toolbar, action }: Props) => {
  const trail: Breadcrumb[] = [
    ...(breadcrumbs ?? []),
    ...(title ? [{ label: title }] : []),
  ];
  return (
    <div className={styles.header}>
      <div className={styles.headerTop}>
        {trail.length > 0 && <Breadcrumbs items={trail} />}
        {action}
      </div>
      {toolbar && <div className={styles.toolbar}>{toolbar}</div>}
    </div>
  );
};
