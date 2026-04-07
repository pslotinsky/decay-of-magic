import type { ClassDescriptor } from './parsing';

type Column<T> = {
  title: string;
  render: (item: T) => string;
};

export function renderClassTable(descriptors: ClassDescriptor[]): string {
  let content = 'No classes found.';

  if (descriptors.length > 0) {
    content = renderTable(descriptors, [
      {
        title: 'Class',
        render: (row) => row.name,
      },
      {
        title: 'File',
        render: (row) => `[\`${row.file}\`](${row.file})`,
      },
      {
        title: 'Description',
        render: (row) => row.description ?? '',
      },
    ]);
  }

  return content;
}

function renderTable<T>(items: T[], columns: Column<T>[]): string {
  const rows = [
    columns.map((column) => column.title),
    columns.map((column) => '-'.repeat(column.title.length)),
    ...items.map((item) => columns.map((col) => col.render(item))),
  ];

  return rows.map((row) => `| ${row.join('|')} |`).join('\n');
}
