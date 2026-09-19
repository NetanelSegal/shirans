import { useEffect } from 'react';
import { Home, Lightbulb } from 'lucide-react';

interface AreaStepProps {
  value: number | undefined;
  onChange: (value: number) => void;
  min: number;
  max: number;
  hint?: string;
}

export function AreaStep({ value, onChange, min, max, hint }: AreaStepProps) {
  const current = value ?? Math.round((min + max) / 2);

  /**
   * The design shows this step pre-filled, and a slider has to sit somewhere
   * regardless — so the midpoint becomes a real answer rather than a placeholder
   * the visitor can't continue past.
   */
  useEffect(() => {
    if (value === undefined) onChange(current);
  }, [value, current, onChange]);

  const commit = (raw: number) => {
    if (Number.isNaN(raw)) return;
    onChange(Math.min(Math.max(Math.round(raw), min), max));
  };

  return (
    <div>
      <p className="mb-4 text-sm text-primary/60">
        ניתן להזין מספר בין {min} ל-{max}.
      </p>

      <div className="flex items-center gap-4 rounded-xl border border-primary/15 bg-white p-4">
        <Home className="size-6 shrink-0 text-primary" aria-hidden />
        <div className="h-8 w-px bg-primary/10" />
        <input
          type="number"
          inputMode="numeric"
          value={value ?? current}
          min={min}
          max={max}
          onChange={(e) => commit(Number(e.target.value))}
          aria-label="שטח הבית במטרים רבועים"
          className="w-full bg-transparent text-center text-4xl font-bold text-primary focus:outline-none"
          placeholder={String(current)}
        />
        <span className="shrink-0 font-bold text-primary/70">מ״ר</span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={10}
        value={current}
        onChange={(e) => commit(Number(e.target.value))}
        aria-label="בחירת שטח הבית"
        className="mt-6 w-full accent-primary"
      />
      <div className="mt-1 flex justify-between text-sm text-primary/60">
        <span>{min}</span>
        <span>{max}</span>
      </div>

      {hint && (
        <div className="mt-8 flex items-start gap-3 rounded-xl bg-white p-4">
          <Lightbulb className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
          <p className="text-sm text-primary/70">{hint}</p>
        </div>
      )}
    </div>
  );
}
