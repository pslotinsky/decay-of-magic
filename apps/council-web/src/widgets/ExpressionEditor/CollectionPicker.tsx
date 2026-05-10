import type { Expression } from '@dod/api-contract';

import { COLLECTION_VALUES } from './expressions';

interface Props {
  value: Expression;
  onChange: (next: Expression) => void;
}

export function CollectionPicker({ value, onChange }: Props) {
  const stringValue = typeof value === 'string' ? value : '';
  return (
    <select
      value={stringValue}
      onChange={(event) => onChange(event.target.value)}
    >
      {!(COLLECTION_VALUES as readonly string[]).includes(stringValue) && (
        <option value="">— pick collection —</option>
      )}
      {COLLECTION_VALUES.map((entry) => (
        <option key={entry} value={entry}>
          {entry}
        </option>
      ))}
    </select>
  );
}
