import type { CostCalculatorConfig } from '@shirans/shared';
import type { ConfigGroup } from '../costCalculatorConfigFields';
import { getByPath } from '@/utils/objectPath';
import { ConfigNumberField } from './ConfigNumberField';

interface ConfigGroupSectionProps {
  group: ConfigGroup;
  config: CostCalculatorConfig;
  onChange: (path: string, value: number) => void;
}

export function ConfigGroupSection({
  group,
  config,
  onChange,
}: ConfigGroupSectionProps) {
  return (
    <section className="rounded-xl border border-primary/15 bg-white p-5">
      <h3 className="font-bold text-primary">{group.title}</h3>
      {group.description && (
        <p className="mt-1 text-sm text-primary/70">{group.description}</p>
      )}

      {group.fields.length > 0 && (
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {group.fields.map((field) => (
          <ConfigNumberField
            key={field.path}
            label={field.label}
            step={field.step}
            suffix={field.suffix}
            value={Number(getByPath(config, field.path) ?? 0)}
            onChange={(value) => onChange(field.path, value)}
          />
        ))}
      </div>
      )}
    </section>
  );
}
