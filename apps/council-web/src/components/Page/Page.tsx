import type { ReactNode } from 'react';

import { NavMenu } from '../NavMenu';
import styles from './Page.module.scss';

interface Props {
  header?: ReactNode;
  children?: ReactNode;
}

export const Page = ({ header, children }: Props) => {
  return (
    <div className={styles.layout}>
      <NavMenu />
      <main className={styles.main}>
        {header}
        {children}
      </main>
    </div>
  );
};
