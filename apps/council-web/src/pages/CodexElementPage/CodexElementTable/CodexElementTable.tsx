import type { ElementDto } from '@dod/api-contract';

import { useUpdateElement } from '@/api/codex';
import { Card } from '@/components/Card';
import { SortableTable } from '@/components/SortableTable';
import { Text } from '@/components/Text';

interface Props {
  elements: ElementDto[];
  onEdit: (element: ElementDto) => void;
}

export function CodexElementTable({ elements, onEdit }: Props) {
  const { mutate } = useUpdateElement();
  return (
    <Card noPadding>
      <SortableTable
        rows={elements}
        columns={[
          {
            header: 'Id',
            cell: (element) => (
              <Text mono muted>
                {element.id}
              </Text>
            ),
          },
          { header: 'Name', cell: (element) => element.name },
        ]}
        onRowClick={onEdit}
        onSetOrder={(id, order) => mutate({ id, order })}
        empty="No elements yet. Create the first to start authoring this Universe."
      />
    </Card>
  );
}
