import { type CitizenDto } from '@/api/citizen';
import { Card } from '@/components/Card';

import styles from './CitizensPageList.module.scss';

interface Props {
  citizens: CitizenDto[];
  loading: boolean;
  error: string | null;
  onEdit: (citizen: CitizenDto) => void;
}

export function CitizensPageList({ citizens, error, onEdit }: Props) {
  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  if (citizens.length === 0) {
    return <p className={styles.muted}>No citizens have been enrolled.</p>;
  }

  return (
    <Card className={styles.card}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nickname</th>
            <th>Id</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {citizens.map((citizen) => (
            <tr key={citizen.id}>
              <td>{citizen.nickname}</td>
              <td className={styles.id}>{citizen.id}</td>
              <td className={styles.actions}>
                <button
                  className={styles.action}
                  onClick={() => onEdit(citizen)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
