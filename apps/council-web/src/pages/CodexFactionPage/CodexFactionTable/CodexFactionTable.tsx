import type { FactionDto } from '@dod/api-contract';

import { Card } from '@/components/Card';
import { Table } from '@/components/Table';
import { Text } from '@/components/Text';

interface Props {
  factions: FactionDto[];
  onEdit: (faction: FactionDto) => void;
}

export function CodexFactionTable({ factions, onEdit }: Props) {
  return (
    <Card noPadding>
      <Table
        rows={factions}
        columns={[
          {
            header: 'Id',
            cell: (faction) => (
              <Text mono muted>
                {faction.id}
              </Text>
            ),
          },
          { header: 'Name', cell: (faction) => faction.name },
        ]}
        onRowClick={onEdit}
        empty="No factions yet."
      />
    </Card>
  );
}
