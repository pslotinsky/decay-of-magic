import type { StatDto } from '@dod/api-contract';

import { Card } from '@/components/Card';
import { Table } from '@/components/Table';
import { Text } from '@/components/Text';

interface Props {
  stats: StatDto[];
  onEdit: (stat: StatDto) => void;
}

export function CodexStatTable({ stats, onEdit }: Props) {
  return (
    <Card noPadding>
      <Table
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
        ]}
        onRowClick={onEdit}
        empty="No stats yet."
      />
    </Card>
  );
}
