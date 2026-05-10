import type { HeroDto } from '@dod/api-contract';

import { Card } from '@/components/Card';
import { Table } from '@/components/Table';
import { Text } from '@/components/Text';

interface Props {
  heroes: HeroDto[];
  onEdit: (hero: HeroDto) => void;
}

export function CodexHeroTable({ heroes, onEdit }: Props) {
  return (
    <Card noPadding>
      <Table
        rows={heroes}
        columns={[
          { header: 'Name', cell: (hero) => hero.name },
          {
            header: 'Faction',
            cell: (hero) => <Text muted>{hero.faction ?? '—'}</Text>,
          },
          {
            header: 'Elements',
            cell: (hero) => (
              <Text muted>{summarizeElements(hero.elements)}</Text>
            ),
          },
        ]}
        onRowClick={onEdit}
        empty="No heroes yet."
      />
    </Card>
  );
}

function summarizeElements(elements: Record<string, number>): string {
  const entries = Object.entries(elements).filter(([, value]) => value > 0);
  if (entries.length === 0) return '—';
  return entries.map(([slug, value]) => `${slug}:${value}`).join(' ');
}
