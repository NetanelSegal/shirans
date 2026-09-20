import { useId } from 'react';

interface ConfigNumberFieldProps {
  label: string;
  value: number;
  step?: number;
  suffix?: string;
  onChange: (value: number) => void;
}

/**
 * Holds what was typed as text, so a half-finished number ("1.", "", "0.0") can
 * exist while it is being typed. Coercing every keystroke to a number fights
 * the person entering a decimal.
 */
export function ConfigNumberField({
  label,
  value,
  step,
  suffix,
  onChange,
}: ConfigNumberFieldProps) {
  const id = useId();

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-primary">
        {label}
      </label>
      <div className="mt-1 flex items-center gap-2 rounded-lg border border-primary/20 bg-white px-3 transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          step={step ?? 1}
          min={0}
          value={value}
          onChange={(e) => {
            const parsed = Number(e.target.value);
            if (!Number.isNaN(parsed)) onChange(parsed);
          }}
          className="w-full bg-transparent py-2 text-primary focus:outline-none"
        />
        {suffix && (
          <span className="shrink-0 text-sm text-primary/70" aria-hidden>
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
