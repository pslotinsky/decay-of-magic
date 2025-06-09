import styles from "./CardPreview.module.scss";

import dummy from "./dummy.png";

export type CardDto = {
  id: string;
  name: string;
  image?: string;
  description: string;
  schoolId: string;
  cost: number;
};

export const CardPreview = ({ name, description, image = dummy }: CardDto) => (
  <div className={styles.card}>
    <img src={image} alt={name} />
    <div className={styles.title}>{name}</div>
    <div className={styles.description}>{description}</div>
  </div>
);
