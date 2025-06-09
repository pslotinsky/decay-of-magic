import type { ReactNode } from "react";

import styles from "./Button.module.scss";

export interface Props {
  children: ReactNode;
}

export const Button = ({ children }: Props) => {
  return <button className={styles.button}>{children}</button>;
};
