import {
  ANSWER_FIELD_LABELS,
  CARPENTRY_LABELS,
  COMPONENT_LABELS,
  FINISH_LEVEL_LABELS,
  INTERIOR_DESIGN_LABELS,
  LEVELS_LABELS,
  PROJECT_STAGE_LABELS,
  REGION_LABELS,
  TIMELINE_LABELS,
  formatShekels,
} from '@shirans/shared';
import type { CostCalculatorAnswers } from '@shirans/shared';

export interface AnswerRow {
  label: string;
  value: string;
}

/**
 * One reading of a lead's answers in Hebrew, used by the admin detail view and
 * by the notification email. Both need the same list, and two hand-written
 * copies of it would drift the first time a question changes.
 */
export function summarizeAnswers(answers: CostCalculatorAnswers): AnswerRow[] {
  return [
    { label: ANSWER_FIELD_LABELS.projectStage, value: PROJECT_STAGE_LABELS[answers.projectStage] },
    { label: ANSWER_FIELD_LABELS.region, value: REGION_LABELS[answers.region] },
    { label: ANSWER_FIELD_LABELS.builtAreaSqm, value: `${answers.builtAreaSqm} מ״ר` },
    { label: ANSWER_FIELD_LABELS.levels, value: LEVELS_LABELS[answers.levels] },
    {
      label: ANSWER_FIELD_LABELS.components,
      value: answers.components.length
        ? answers.components.map((c) => COMPONENT_LABELS[c]).join(', ')
        : 'ללא',
    },
    { label: ANSWER_FIELD_LABELS.finishLevel, value: FINISH_LEVEL_LABELS[answers.finishLevel] },
    { label: ANSWER_FIELD_LABELS.carpentry, value: CARPENTRY_LABELS[answers.carpentry] },
    { label: ANSWER_FIELD_LABELS.interiorDesign, value: INTERIOR_DESIGN_LABELS[answers.interiorDesign] },
    { label: ANSWER_FIELD_LABELS.timeline, value: TIMELINE_LABELS[answers.timeline] },
  ];
}

/** For places that can only take a plain string: an email field, a WhatsApp message. */
export function formatEstimate(estimate: number): string {
  return `${formatShekels(estimate)} ₪`;
}
