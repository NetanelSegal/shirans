import type { CalculatorComponent } from '@shirans/shared';
import { ChoiceCard } from '../ChoiceCard';
import type { MultiChoiceStep as MultiChoiceStepDefinition } from '../types';

interface MultiChoiceStepProps {
  step: MultiChoiceStepDefinition;
  value: CalculatorComponent[];
  onChange: (value: CalculatorComponent[]) => void;
}

export function MultiChoiceStep({
  step,
  value,
  onChange,
}: MultiChoiceStepProps) {
  const toggle = (option: CalculatorComponent) => {
    onChange(
      value.includes(option)
        ? value.filter((item) => item !== option)
        : [...value, option],
    );
  };

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-4">
      {step.options.map((option) => (
        <ChoiceCard
          key={option.value}
          option={option}
          variant={option.image ? 'image' : 'icon'}
          selected={value.includes(option.value as CalculatorComponent)}
          onSelect={() => toggle(option.value as CalculatorComponent)}
        />
      ))}
    </div>
  );
}
