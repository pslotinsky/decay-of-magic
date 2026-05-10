import {
  type EffectDto,
  type Expression,
  isMinionActivation,
  type Target,
  TARGET_VALUES,
} from '@dod/api-contract';

import { ButtonSelect } from '@/components/ButtonSelect';
import { PillToggle } from '@/components/PillToggle';
import { ExpressionEditor } from '@/widgets/ExpressionEditor';

import type { AbilityComposerContext } from './AbilityComposer';

import styles from './AbilityComposer.module.scss';

interface Props {
  effect: EffectDto;
  context: AbilityComposerContext;
  onChange: (next: EffectDto) => void;
}

export function EffectParams({ effect, context, onChange }: Props) {
  switch (effect.kind) {
    case 'damage':
    case 'heal':
      return (
        <ExpressionField
          label="Amount"
          value={effect.params.amount}
          onChange={(amount) => onChange({ ...effect, params: { amount } })}
        />
      );
    case 'fullHeal':
    case 'destroy':
    case 'preventDamage':
    case 'reflectDamage':
      return null;
    case 'attackNow': {
      const params = effect.params;
      return (
        <label className={styles.field}>
          <span className={styles.label}>Target (override)</span>
          <select
            value={params.target ?? ''}
            onChange={(event) => {
              const value = event.target.value;
              onChange({
                ...effect,
                params: value === '' ? {} : { target: value as Target },
              });
            }}
          >
            {TARGET_VALUES.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
      );
    }
    case 'gainElement':
    case 'decreaseElement':
      return (
        <SlugRecordField
          label="Per element"
          addLabel="+ Add element"
          options={context.elements}
          value={effect.params}
          onChange={(params) => onChange({ ...effect, params })}
        />
      );
    case 'increaseStat':
    case 'decreaseStat':
    case 'multiplyStat':
    case 'setStat':
      return (
        <SlugRecordField
          label="Per stat"
          addLabel="+ Add stat"
          options={context.stats}
          value={effect.params}
          onChange={(params) => onChange({ ...effect, params })}
        />
      );
    case 'giveTraits': {
      const params = effect.params;
      return (
        <>
          <TraitListField
            label="Traits"
            options={context.traits}
            value={params.traits}
            onChange={(traits) =>
              onChange({ ...effect, params: { ...params, traits } })
            }
          />
          <label className={styles.field}>
            <span className={styles.label}>Duration (turns)</span>
            <input
              type="number"
              min={0}
              value={params.duration ?? 0}
              onFocus={(event) => event.currentTarget.select()}
              onWheel={(event) => event.currentTarget.blur()}
              onChange={(event) => {
                const value = Number(event.target.value);
                const next = { traits: params.traits } as typeof params;
                if (value > 0) {
                  next.duration = value;
                }
                onChange({ ...effect, params: next });
              }}
            />
          </label>
        </>
      );
    }
    case 'removeTraits':
      return (
        <TraitListField
          label="Traits"
          options={context.traits}
          value={effect.params.traits}
          onChange={(traits) => onChange({ ...effect, params: { traits } })}
        />
      );
    case 'summon':
      return (
        <label className={styles.field}>
          <span className={styles.label}>Minion (card id)</span>
          <select
            value={effect.params.minion}
            onChange={(event) =>
              onChange({
                ...effect,
                params: { minion: event.target.value },
              })
            }
          >
            <option value="">— pick a card —</option>
            {context.cards
              .filter((card) => isMinionActivation(card.activation))
              .map((card) => (
                <option key={card.id} value={card.id}>
                  {card.name}
                </option>
              ))}
          </select>
        </label>
      );
    case 'replaceWith':
      return (
        <label className={styles.field}>
          <span className={styles.label}>Replacement card</span>
          <select
            value={effect.params.card}
            onChange={(event) =>
              onChange({
                ...effect,
                params: { card: event.target.value },
              })
            }
          >
            <option value="">— pick a card —</option>
            {context.cards.map((card) => (
              <option key={card.id} value={card.id}>
                {card.name}
              </option>
            ))}
          </select>
        </label>
      );
  }
}

interface ExpressionFieldProps {
  label: string;
  value: Expression;
  onChange: (next: Expression) => void;
}

function ExpressionField({ label, value, onChange }: ExpressionFieldProps) {
  return (
    <div className={styles.field}>
      <span className={styles.label}>{label}</span>
      <ExpressionEditor value={value} onChange={onChange} />
    </div>
  );
}

interface SlugRecordFieldProps {
  label: string;
  addLabel: string;
  options: { id: string; name: string; order?: number }[];
  value: Record<string, Expression>;
  onChange: (next: Record<string, Expression>) => void;
}

function SlugRecordField({
  label,
  addLabel,
  options,
  value,
  onChange,
}: SlugRecordFieldProps) {
  const sorted = sortByOrder(options);
  const visible = sorted.filter((option) => option.id in value);
  const addable = sorted.filter((option) => !(option.id in value));

  function remove(slug: string) {
    const next = { ...value };
    delete next[slug];
    onChange(next);
  }

  return (
    <div className={styles.field}>
      <span className={styles.label}>{label}</span>
      {visible.length > 0 && (
        <div className={styles.slugRecord}>
          {visible.map((option) => (
            <div key={option.id} className={styles.slugRow}>
              <div className={styles.slugLabelRow}>
                <span className={styles.slugLabel}>{option.name}</span>
              </div>
              <ExpressionEditor
                value={value[option.id]}
                onChange={(next) => onChange({ ...value, [option.id]: next })}
                onClear={() => remove(option.id)}
              />
            </div>
          ))}
        </div>
      )}
      {addable.length > 0 && (
        <ButtonSelect
          value=""
          onChange={(slug) => onChange({ ...value, [slug]: 0 })}
          options={addable.map((option) => ({
            value: option.id,
            label: option.name,
          }))}
          placeholder={addLabel}
          variant="label"
          ariaLabel={addLabel}
        />
      )}
    </div>
  );
}

interface TraitListFieldProps {
  label: string;
  options: { id: string; name: string; order?: number }[];
  value: string[];
  onChange: (next: string[]) => void;
}

function TraitListField({
  label,
  options,
  value,
  onChange,
}: TraitListFieldProps) {
  const sorted = sortByOrder(options);
  function toggle(id: string) {
    onChange(
      value.includes(id)
        ? value.filter((entry) => entry !== id)
        : [...value, id],
    );
  }

  return (
    <div className={styles.field}>
      <span className={styles.label}>{label}</span>
      <div className={styles.pillRow}>
        {sorted.map((option) => (
          <PillToggle
            key={option.id}
            selected={value.includes(option.id)}
            onToggle={() => toggle(option.id)}
          >
            {option.name}
          </PillToggle>
        ))}
      </div>
    </div>
  );
}

function sortByOrder<T extends { name: string; order?: number }>(
  items: readonly T[],
): T[] {
  return [...items].sort((a, b) => {
    const aOrder = a.order ?? Number.POSITIVE_INFINITY;
    const bOrder = b.order ?? Number.POSITIVE_INFINITY;
    if (aOrder !== bOrder) {
      return aOrder - bOrder;
    }
    return a.name.localeCompare(b.name);
  });
}
