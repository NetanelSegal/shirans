import { ChoiceCard } from '../ChoiceCard';
import type { SingleChoiceStep as SingleChoiceStepDefinition } from '../types';

interface SingleChoiceStepProps {
  step: SingleChoiceStepDefinition;
  value: string | undefined;
  onChange: (value: string) => void;
}

/**
 * Two across on a phone, not one.
 *
 * A single column of full-width cards put 1,525px of options on the components
 * step — nearly two phone screens of nothing but cards, before the visitor
 * could reach the button. The options are recognised by their picture, and a
 * half-width picture is still plainly legible.
 */
const layoutClasses: Record<SingleChoiceStepDefinition['layout'], string> = {
  'icon-grid': 'grid grid-cols-2 gap-3',
  'image-grid': 'grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-4',
  // Three across at every size: there are exactly three, and stacking them made
  // the shortest step on the wizard scroll.
  'row-list': 'grid grid-cols-3 gap-2 md:gap-4',
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
