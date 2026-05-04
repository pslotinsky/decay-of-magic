import { createContext, useContext } from 'react';

import type {
  ElementDto,
  FactionDto,
  StatDto,
  TraitDto,
} from '@dod/api-contract';

export interface ExpressionEditorContextValue {
  elements: ElementDto[];
  factions: FactionDto[];
  stats: StatDto[];
  traits: TraitDto[];
}

const ExpressionEditorReactContext =
  createContext<ExpressionEditorContextValue | null>(null);

export const ExpressionEditorProvider = ExpressionEditorReactContext.Provider;

export function useExpressionEditorContext(): ExpressionEditorContextValue | null {
  return useContext(ExpressionEditorReactContext);
}
