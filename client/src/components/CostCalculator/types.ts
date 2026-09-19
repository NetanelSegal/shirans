import type { LucideIcon } from 'lucide-react';
import type { CostCalculatorAnswers } from '@shirans/shared';

export type AnswerKey = keyof CostCalculatorAnswers;

export interface ChoiceOption {
  value: string;
  label: string;
  sublabel?: string;
  /** Imported asset URL. File names mirror the option value (see assets/calculator). */
  image?: string;
  icon?: LucideIcon;
}

interface StepBase {
  title: string;
  subtitle?: string;
}

export interface SingleChoiceStep extends StepBase {
  kind: 'single';
  id: Exclude<AnswerKey, 'builtAreaSqm' | 'components'>;
  layout: 'icon-grid' | 'image-grid' | 'row-list';
  options: ChoiceOption[];
}

export interface AreaStep extends StepBase {
  kind: 'area';
  id: 'builtAreaSqm';
  hint?: string;
}

export interface MultiChoiceStep extends StepBase {
  kind: 'multi';
  id: 'components';
  options: ChoiceOption[];
}

export interface ContactStep extends StepBase {
  kind: 'contact';
  id: 'contact';
}

export type StepDefinition =
  | SingleChoiceStep
  | AreaStep
  | MultiChoiceStep
  | ContactStep;
