import type { StatDto } from '@dod/api-contract';

import { useUpdateStat } from '@/api/codex';
import { Card } from '@/components/Card';
import { SortableTable } from '@/components/SortableTable';
import { Text } from '@/components/Text';

interface Props {
  stats: StatDto[];
  onEdit: (stat: StatDto) => void;
}

export function CodexStatTable({ stats, onEdit }: Props) {
  const { mutate } = useUpdateStat();
  return (
    <Card noPadding>
      <SortableTable
        rows={stats}
        columns={[
          {
            header: 'Id',
            cell: (stat) => (
              <Text mono muted>
                {stat.id}
              </Text>
            ),
          },
          { header: 'Name', cell: (stat) => stat.name },
          {
            header: 'Applies to',
            cell: (stat) => (
              <Text muted italic>
                {stat.appliesTo.join(', ')}
              </Text>
            ),
          },
          {
            header: 'Required',
            cell: (stat) => (stat.required ? 'yes' : '—'),
          },
        ]}
        onRowClick={onEdit}
        onSetOrder={(id, order) => mutate({ id, order })}
        empty="No stats yet."
      />
    </Card>
  );
}
