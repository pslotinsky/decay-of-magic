import type { ElementDto } from '@dod/api-contract';

import { Card } from '@/components/Card';
import { Table } from '@/components/Table';
import { Text } from '@/components/Text';

interface Props {
  elements: ElementDto[];
  onEdit: (element: ElementDto) => void;
}

export function CodexElementTable({ elements, onEdit }: Props) {
  return (
    <Card noPadding>
      <Table
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
        empty="No elements yet. Create the first to start authoring this Universe."
      />
    </Card>
  );
}
