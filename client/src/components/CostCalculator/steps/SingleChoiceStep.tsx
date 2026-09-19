import { ChoiceCard } from '../ChoiceCard';
import type { SingleChoiceStep as SingleChoiceStepDefinition } from '../types';

interface SingleChoiceStepProps {
  step: SingleChoiceStepDefinition;
  value: string | undefined;
  onChange: (value: string) => void;
}

const layoutClasses: Record<SingleChoiceStepDefinition['layout'], string> = {
  'icon-grid': 'grid grid-cols-1 gap-3 sm:grid-cols-2',
  'image-grid': 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3',
  // Stacked on phones, side-by-side boxes from tablet up — as full-width rows the
  // desktop layout left most of the card empty.
  'row-list': 'flex flex-col gap-3 md:grid md:auto-cols-fr md:grid-flow-col md:gap-4',
};

const cardVariant: Record<
  SingleChoiceStepDefinition['layout'],
  'icon' | 'image' | 'row'
> = {
  'icon-grid': 'icon',
  'image-grid': 'image',
  'row-list': 'row',
};

export function SingleChoiceStep({
  step,
  value,
  onChange,
}: SingleChoiceStepProps) {
  return (
    <div className={layoutClasses[step.layout]}>
      {step.options.map((option) => (
        <ChoiceCard
          key={option.value}
          option={option}
          variant={cardVariant[step.layout]}
          selected={value === option.value}
          onSelect={() => onChange(option.value)}
        />
      ))}
    </div>
  );
}
