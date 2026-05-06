import type {
  CardDto,
  ElementDto,
  FactionDto,
  HeroDto,
  StatDto,
  TraitDto,
} from '@dod/api-contract';

import { AbilityComposer } from '@/components/AbilityComposer';
import {
  ExpressionEditor,
  ExpressionEditorProvider,
} from '@/components/ExpressionEditor';
import { Form, FormField } from '@/components/Form';
import { ImageInput } from '@/components/ImageInput';
import { PillToggleList } from '@/components/PillToggleList';
import { Textarea } from '@/components/Textarea';

import { type HeroFormPayload, useCodexHeroForm } from './useCodexHeroForm';

import styles from './CodexHeroForm.module.scss';

export type { HeroFormPayload };

interface Props {
  formId: string;
  initial?: HeroDto;
  elements: ElementDto[];
  factions: FactionDto[];
  stats: StatDto[];
  traits: TraitDto[];
  cards: CardDto[];
  onSubmit: (payload: HeroFormPayload) => void;
}

export function CodexHeroForm({
  formId,
  initial,
  elements,
  factions,
  stats,
  traits,
  cards,
  onSubmit,
}: Props) {
  const form = useCodexHeroForm({ initial, elements, stats, traits, onSubmit });

  return (
    <ExpressionEditorProvider value={{ elements, factions, stats, traits }}>
      <Form id={formId} onSubmit={form.handleSubmit}>
        {!form.isEditMode && (
          <FormField label="Id">
            <input
              value={form.id}
              onChange={(event) => form.setId(event.target.value)}
              placeholder="e.g. archmage"
              required
            />
          </FormField>
        )}
        <FormField label="Name">
          <input
            value={form.name}
            onChange={(event) => form.setName(event.target.value)}
            required
          />
        </FormField>
        <FormField label="Description">
          <Textarea
            value={form.description}
            onChange={(event) => form.setDescription(event.target.value)}
            placeholder="Optional"
          />
        </FormField>
        <FormField label="Faction">
          <select
            value={form.faction}
            onChange={(event) => form.setFaction(event.target.value)}
          >
            <option value="">none</option>
            {factions.map((entry) => (
              <option key={entry.id} value={entry.id}>
                {entry.name}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Art">
          <ImageInput value={form.art} onChange={form.setArt} />
        </FormField>
        {elements.length > 0 && (
          <FormField label="Starting elements">
            <div className={styles.numberGrid}>
              {elements.map((element) => (
                <label key={element.id} className={styles.numberRow}>
                  <span className={styles.numberLabel}>{element.name}</span>
                  <input
                    type="number"
                    min={0}
                    value={form.elementValues[element.id] ?? 0}
                    onFocus={(event) => event.currentTarget.select()}
                    onWheel={(event) => event.currentTarget.blur()}
                    onChange={(event) =>
                      form.updateElement(element.id, Number(event.target.value))
                    }
                  />
                </label>
              ))}
            </div>
          </FormField>
        )}
        {form.heroStats.length > 0 && (
          <FormField label="Stats">
            <div className={styles.expressionGrid}>
              {form.heroStats.map((stat) => (
                <div key={stat.id} className={styles.expressionRow}>
                  <span className={styles.numberLabel}>{stat.name}</span>
                  <ExpressionEditor
                    value={form.statValues[stat.id] ?? 0}
                    onChange={(next) => form.updateStat(stat.id, next)}
                  />
                </div>
              ))}
            </div>
          </FormField>
        )}
        {form.heroTraits.length > 0 && (
          <FormField label="Traits">
            <PillToggleList
              items={form.heroTraits}
              isSelected={(trait) => form.traitIds.has(trait.id)}
              onToggle={(trait) => form.toggleTrait(trait.id)}
              keyOf={(trait) => trait.id}
              labelOf={(trait) => trait.name}
            />
          </FormField>
        )}
        <FormField label="Abilities">
          <AbilityComposer
            value={form.abilities}
            onChange={form.setAbilities}
            context={{ elements, factions, stats, traits, cards }}
          />
        </FormField>
      </Form>
    </ExpressionEditorProvider>
  );
}
