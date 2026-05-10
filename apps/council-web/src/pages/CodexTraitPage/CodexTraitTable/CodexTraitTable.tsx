import type { TraitDto } from '@dod/api-contract';

import { useUpdateTrait } from '@/api/codex';
import { Card } from '@/components/Card';
import { SortableTable } from '@/components/SortableTable';
import { Text } from '@/components/Text';

interface Props {
  traits: TraitDto[];
  onEdit: (trait: TraitDto) => void;
}

export function CodexTraitTable({ traits, onEdit }: Props) {
  const { mutate } = useUpdateTrait();
  return (
    <Card noPadding>
      <SortableTable
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
        onSetOrder={(id, order) => mutate({ id, order })}
        empty="No traits yet."
      />
    </Card>
  );
}
