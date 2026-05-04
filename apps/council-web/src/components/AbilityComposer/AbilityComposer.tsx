import { Plus } from 'lucide-react';

import type {
  AbilityDto,
  CardDto,
  ElementDto,
  FactionDto,
  StatDto,
  TraitDto,
} from '@dod/api-contract';

import { Button } from '@/components/Button';
import { ExpressionEditorProvider } from '@/components/ExpressionEditor';

import { defaultAbility } from './abilities';
import { AbilityEditor } from './AbilityEditor';

import styles from './AbilityComposer.module.scss';

export interface AbilityComposerContext {
  elements: ElementDto[];
  factions: FactionDto[];
  stats: StatDto[];
  traits: TraitDto[];
  cards: CardDto[];
}

interface Props {
  value: AbilityDto[];
  onChange: (next: AbilityDto[]) => void;
  context: AbilityComposerContext;
}

export function AbilityComposer({ value, onChange, context }: Props) {
  function add() {
    onChange([...value, defaultAbility]);
  }

  function update(index: number, ability: AbilityDto) {
    const next = [...value];
    next[index] = ability;
    onChange(next);
  }

  function remove(index: number) {
    onChange(value.filter((_, current) => current !== index));
  }

  function move(index: number, delta: -1 | 1) {
    const target = index + delta;
    if (target < 0 || target >= value.length) {
      return;
    }
    const next = [...value];
    [next[index], next[target]] = [next[target]!, next[index]!];
    onChange(next);
  }

  return (
    <ExpressionEditorProvider
      value={{
        elements: context.elements,
        factions: context.factions,
        stats: context.stats,
        traits: context.traits,
      }}
    >
      <div className={styles.composer}>
        {value.map((ability, index) => (
          <AbilityEditor
            key={index}
            ability={ability}
            context={context}
            onChange={(updated) => update(index, updated)}
            onRemove={() => remove(index)}
            onMoveUp={index > 0 ? () => move(index, -1) : undefined}
            onMoveDown={
              index < value.length - 1 ? () => move(index, 1) : undefined
            }
          />
        ))}
        <Button variant="secondary" onClick={add}>
          <span className={styles.addInner}>
            <Plus size={16} />
            Add ability
          </span>
        </Button>
      </div>
    </ExpressionEditorProvider>
  );
}
