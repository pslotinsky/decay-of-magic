import type { ElementDto, FactionDto } from '@dod/api-contract';

import { useUpdateFaction } from '@/api/codex';
import { Card } from '@/components/Card';
import { SortableTable } from '@/components/SortableTable';
import { Text } from '@/components/Text';

interface Props {
  factions: FactionDto[];
  elements: ElementDto[];
  onEdit: (faction: FactionDto) => void;
}

export function CodexFactionTable({ factions, elements, onEdit }: Props) {
  const { mutate } = useUpdateFaction();
  const elementNameById = new Map(
    elements.map((element) => [element.id, element.name]),
  );

  return (
    <Card noPadding>
      <SortableTable
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
              const factionElements = faction.elements ?? [];
              return factionElements.length > 0
                ? factionElements
                    .map((slug) => elementNameById.get(slug) ?? slug)
                    .join(', ')
                : '—';
            },
          },
        ]}
        onRowClick={onEdit}
        onSetOrder={(id, order) => mutate({ id, order })}
        empty="No factions yet."
      />
    </Card>
  );
}
