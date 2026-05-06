import type { TraitDto } from '@dod/api-contract';

import { Card } from '@/components/Card';
import { Table } from '@/components/Table';
import { Text } from '@/components/Text';

interface Props {
  traits: TraitDto[];
  onEdit: (trait: TraitDto) => void;
}

export function CodexTraitTable({ traits, onEdit }: Props) {
  return (
    <Card noPadding>
      <Table
        rows={traits}
        columns={[
          {
            header: 'Id',
            cell: (trait) => (
              <Text mono muted>
                {trait.id}
              </Text>
            ),
          },
          { header: 'Name', cell: (trait) => trait.name },
          {
            header: 'Applies to',
            cell: (trait) => (
              <Text muted italic>
                {trait.appliesTo.join(', ')}
              </Text>
            ),
          },
        ]}
        onRowClick={onEdit}
        empty="No traits yet."
      />
    </Card>
  );
}
