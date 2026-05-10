import type { Expression } from '@dod/api-contract';

import { useExpressionEditorContext } from './context';

interface Props {
  value: Expression;
  onChange: (next: Expression) => void;
}

export function StatPicker({ value, onChange }: Props) {
  const ctx = useExpressionEditorContext();
  const stringValue = typeof value === 'string' ? value : '';
  const stats = ctx?.stats ?? [];

  if (stats.length === 0) {
    return (
      <input
        value={stringValue}
        onChange={(event) => onChange(event.target.value)}
        placeholder="stat slug"
      />
    );
  }

  const knownIds = new Set(stats.map((entry) => entry.id));

  return (
    <select
      value={stringValue}
      onChange={(event) => onChange(event.target.value)}
    >
      {!knownIds.has(stringValue) && <option value="">— pick stat —</option>}
      {stats.map((entry) => (
        <option key={entry.id} value={entry.id}>
          {entry.name}
        </option>
      ))}
    </select>
  );
}
