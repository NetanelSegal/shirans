import { calculateCost } from '@shirans/shared';
import type { CostCalculatorAnswers, CostCalculatorConfig } from '@shirans/shared';
import { ShekelAmount } from '@/components/ui/ShekelAmount';

/**
 * A fixed, representative house. The numbers above are multipliers and addends;
 * on their own they don't say what a visitor will actually be quoted, and the
 * only way to tell whether a change went the right way is to see one result
 * move.
 */
const SAMPLE_HOUSE: CostCalculatorAnswers = {
  projectStage: 'has_plot',
  region: 'center',
  builtAreaSqm: 250,
  levels: 'two',
  components: ['pool'],
  finishLevel: 'high',
  carpentry: 'custom',
  interiorDesign: 'partial',
  timeline: '3_6_months',
};

const SAMPLE_DESCRIPTION =
  '250 מ״ר במרכז, שתי קומות, גימור גבוה, נגרות בהתאמה אישית, עיצוב פנים חלקי ובריכה';

export function ConfigEstimatePreview({
  config,
}: {
  config: CostCalculatorConfig;
}) {
  const estimate = calculateCost(SAMPLE_HOUSE, config);

  return (
    <aside className="rounded-xl bg-secondary p-5" aria-live="polite">
      <h3 className="font-bold text-primary">בית לדוגמה</h3>
      <p className="mt-1 text-sm text-primary/70">{SAMPLE_DESCRIPTION}</p>
      <ShekelAmount value={estimate} className="mt-3 block text-xl font-bold text-primary" />
    </aside>
  );
}
