import type { ElementDto, FactionDto } from '@dod/api-contract';

import { Card } from '@/components/Card';
import { Table } from '@/components/Table';
import { Text } from '@/components/Text';

interface Props {
  factions: FactionDto[];
  elements: ElementDto[];
  onEdit: (faction: FactionDto) => void;
}

export function CodexFactionTable({ factions, elements, onEdit }: Props) {
  const elementNameById = new Map(
    elements.map((element) => [element.id, element.name]),
  );

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
          {
            header: 'Elements',
            cell: (faction) => {
              const elements = faction.elements ?? [];
              return elements.length > 0
                ? elements
                    .map((slug) => elementNameById.get(slug) ?? slug)
                    .join(', ')
                : '—';
            },
          },
        ]}
        onRowClick={onEdit}
        empty="No factions yet."
      />
    </Card>
  );
}
