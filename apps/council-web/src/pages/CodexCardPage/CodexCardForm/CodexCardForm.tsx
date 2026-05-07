import {
  ACTIVATION_VALUES,
  type CardArtSettings,
  type CardDto,
  type ElementDto,
  type FactionDto,
  type StatDto,
  type TraitDto,
} from '@dod/api-contract';

import { Form, FormField } from '@/components/Form';
import { ImageInput } from '@/components/ImageInput';
import { PillToggleList } from '@/components/PillToggleList';
import { Textarea } from '@/components/Textarea';
import { AbilityComposer } from '@/widgets/AbilityComposer';
import {
  ExpressionEditor,
  ExpressionEditorProvider,
} from '@/widgets/ExpressionEditor';

import { type CardFormPayload, useCodexCardForm } from './useCodexCardForm';

import styles from './CodexCardForm.module.scss';

export type { CardFormPayload };

interface Props {
  formId: string;
  initial?: Partial<CardDto>;
  elements: ElementDto[];
  factions: FactionDto[];
  stats: StatDto[];
  traits: TraitDto[];
  cards: CardDto[];
  cardArt: CardArtSettings;
  onSubmit: (payload: CardFormPayload) => void;
}

export function CodexCardForm({
  formId,
  initial,
  elements,
  factions,
  stats,
  traits,
  cards,
  cardArt,
  onSubmit,
}: Props) {
  const form = useCodexCardForm({ initial, stats, traits, onSubmit });

  return (
    <ExpressionEditorProvider value={{ elements, factions, stats, traits }}>
      <Form id={formId} onSubmit={form.handleSubmit}>
        {!form.isEditMode && (
          <FormField label="Id">
            <input
              value={form.id}
              onChange={(event) => form.setId(event.target.value)}
              placeholder="e.g. goblinBerserker"
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
        <FormField label="Activation">
          <PillToggleList
            items={ACTIVATION_VALUES}
            isSelected={(value) => form.activation === value}
            onToggle={form.setActivation}
          />
        </FormField>
        <FormField label="Art">
          <ImageInput
            value={form.art}
            onChange={form.setArt}
            aspect={cardArt.aspect}
            defaultWidth={cardArt.width}
          />
        </FormField>
        {factions.length > 0 && (
          <FormField label="Factions">
            <PillToggleList
              items={factions}
              isSelected={(faction) => form.factionIds.has(faction.id)}
              onToggle={(faction) => form.toggleFaction(faction.id)}
              keyOf={(faction) => faction.id}
              labelOf={(faction) => faction.name}
            />
          </FormField>
        )}
        {elements.length > 0 && (
          <FormField label="Cost">
            <div className={styles.numberGrid}>
              {elements.map((element) => (
                <label key={element.id} className={styles.numberRow}>
                  <span className={styles.numberLabel}>{element.name}</span>
                  <input
                    type="number"
                    min={0}
                    value={form.cost[element.id] ?? ''}
                    onFocus={(event) => event.currentTarget.select()}
                    onWheel={(event) => event.currentTarget.blur()}
                    onChange={(event) =>
                      form.setCost(element.id, event.target.value)
                    }
                  />
                </label>
              ))}
            </div>
          </FormField>
        )}
        {form.activation === 'emptySlot' && form.minionStats.length > 0 && (
          <FormField label="Stats">
            <div className={styles.expressionGrid}>
              {form.minionStats.map((stat) => (
                <div key={stat.id} className={styles.expressionRow}>
                  <span className={styles.numberLabel}>{stat.name}</span>
                  <ExpressionEditor
                    value={form.statValues[stat.id]}
                    onChange={(next) => form.updateStat(stat.id, next)}
                    onClear={() => form.clearStat(stat.id)}
                  />
                </div>
              ))}
            </div>
          </FormField>
        )}
        {form.filteredTraits.length > 0 && (
          <FormField label="Traits">
            <PillToggleList
              items={form.filteredTraits}
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
