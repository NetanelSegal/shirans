import { useId, useState } from 'react';

interface ConfigNumberFieldProps {
  label: string;
  value: number;
  step?: number;
  suffix?: string;
  onChange: (value: number) => void;
}

/**
 * Holds what was typed as text while the field has focus.
 *
 * A controlled `type="number"` cannot: the moment you type the dot in "1.15"
 * the element reports an empty value, `Number('')` is 0, and the 0 is written
 * straight back over the "1." that was there. Decimals — which is what every
 * multiplier on this screen is — become impossible to enter. Clearing a field
 * to retype it has the same problem, and silently commits 0.
 */
export function ConfigNumberField({
  label,
  value,
  step,
  suffix,
  onChange,
}: ConfigNumberFieldProps) {
  const id = useId();
  const [typed, setTyped] = useState<string | null>(null);

  const handleChange = (raw: string) => {
    setTyped(raw);
    const parsed = Number(raw);
    // An empty or half-finished entry stays on screen without becoming a value.
    if (raw.trim() === '' || Number.isNaN(parsed)) return;
    onChange(parsed);
  };

  /** Leaving the field with nothing usable in it restores the last good value. */
  const handleBlur = () => setTyped(null);

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-primary">
        {label}
      </label>
      <div className="mt-1 flex items-center gap-2 rounded-lg border border-primary/20 bg-white px-3 transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30">
        <input
          id={id}
          // `text` with a numeric inputMode rather than `type="number"`: the
          // number input is what discards the intermediate states above.
          type="text"
          inputMode="decimal"
          step={step ?? 1}
          value={typed ?? String(value)}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
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
