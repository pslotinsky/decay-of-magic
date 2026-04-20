import type { CardDto } from '@dod/api-contract';

import { Card } from '../Card';
import dummy from './dummy.png';

import styles from './CardPreview.module.scss';

export const CardPreview = ({
  name,
  description,
  imageUrl = dummy,
}: CardDto) => (
  <Card interactive className={styles.card}>
    <img className={styles.image} src={imageUrl} alt={name} />
    <div className={styles.title}>{name}</div>
    <div className={styles.description}>{description}</div>
  </Card>
);
