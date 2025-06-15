import type { ReactNode } from "react";

import styles from "./Page.module.scss";

interface Props {
  children?: ReactNode;
}

export const Page = ({ children }: Props) => {
  return <div className={styles.page}>{children}</div>;
};
