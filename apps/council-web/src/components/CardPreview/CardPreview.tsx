import { Card } from '../Card';
import dummy from './dummy.png';

import styles from './CardPreview.module.scss';

export type CardDto = {
  id: string;
  name: string;
  image?: string;
  description: string;
  schoolId: string;
  cost: number;
};

export const CardPreview = ({ name, description, image = dummy }: CardDto) => (
  <Card interactive className={styles.card}>
    <img className={styles.image} src={image} alt={name} />
    <div className={styles.title}>{name}</div>
    <div className={styles.description}>{description}</div>
  </Card>
);
