import type { Expression } from '@dod/api-contract';

import { useExpressionEditorContext } from './context';
import {
  CUSTOM_FIELD,
  fieldGroups,
  flattenFields,
  PATH_ROOTS,
} from './expressions';

import styles from './ExpressionEditor.module.scss';

interface Props {
  value: Expression;
  onChange: (next: Expression) => void;
}

export function PathBody({ value, onChange }: Props) {
  const ctx = useExpressionEditorContext();
  const groups = fieldGroups(ctx);
  const knownFields = flattenFields(groups);

  const str = typeof value === 'string' ? value : 'self';
  const head = str.split('.')[0] ?? 'self';
  const rest = str.includes('.') ? str.slice(head.length + 1) : '';
  const root = (PATH_ROOTS as readonly string[]).includes(head) ? head : 'self';
  const isCustom = rest !== '' && !knownFields.includes(rest);

  function emit(nextRoot: string, nextField: string) {
    onChange(nextField ? `${nextRoot}.${nextField}` : nextRoot);
  }

  return (
    <div className={styles.pathRow}>
      <select value={root} onChange={(event) => emit(event.target.value, rest)}>
        {PATH_ROOTS.map((entry) => (
          <option key={entry} value={entry}>
            {entry}
          </option>
        ))}
      </select>
      <select
        value={isCustom ? CUSTOM_FIELD : rest}
        onChange={(event) => {
          const next = event.target.value;
          if (next === CUSTOM_FIELD) {
            emit(root, '');
            return;
          }
          emit(root, next);
        }}
      >
        <option value="">— root —</option>
        {groups.map((group) => (
          <optgroup key={group.label} label={group.label}>
            {group.options.map((entry) => (
              <option key={entry} value={entry}>
                {entry}
              </option>
            ))}
          </optgroup>
        ))}
        <option value={CUSTOM_FIELD}>custom…</option>
      </select>
      {isCustom && (
        <input
          value={rest}
          onChange={(event) => {
            const suffix = event.target.value.replace(/^\./, '');
            emit(root, suffix);
          }}
          placeholder="custom.path"
        />
      )}
    </div>
  );
}
