import type { ReactNode } from 'react';

import styles from './Page.module.scss';

interface Props {
  nav: ReactNode;
  header?: ReactNode;
  children?: ReactNode;
}

export const Page = ({ nav, header, children }: Props) => {
  return (
    <div className={styles.layout}>
      {nav}
      <main className={styles.main}>
        {header}
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
};
