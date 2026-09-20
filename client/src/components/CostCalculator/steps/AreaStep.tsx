import { useEffect, useState } from 'react';
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
   * What the field shows while it is being typed in. Clamping on every keystroke
   * — which is what committing straight through does — makes the field
   * unusable: with a 100–500 range, selecting the number and typing "3" snaps to
   * 100 before the "00" arrives, so most values can't be reached at all. The
   * typed text is held here and only becomes an answer once it is in range, or
   * on blur.
   */
  const [typed, setTyped] = useState<string | null>(null);

  /**
   * The design shows this step pre-filled, and a slider has to sit somewhere
   * regardless — so the midpoint becomes a real answer rather than a placeholder
   * the visitor can't continue past.
   */
  useEffect(() => {
    if (value === undefined) onChange(current);
  }, [value, current, onChange]);

  const clamp = (raw: number) => Math.min(Math.max(Math.round(raw), min), max);

  const handleType = (raw: string) => {
    setTyped(raw);
    const parsed = Number(raw);
    if (raw === '' || Number.isNaN(parsed)) return;
    if (parsed >= min && parsed <= max) onChange(Math.round(parsed));
  };

  /** Out-of-range or empty input falls back to the last good value. */
  const handleBlur = () => {
    const parsed = Number(typed);
    setTyped(null);
    if (typed === null || typed === '' || Number.isNaN(parsed)) return;
    onChange(clamp(parsed));
  };

  const handleSlide = (raw: number) => {
    if (Number.isNaN(raw)) return;
    setTyped(null);
    onChange(clamp(raw));
  };

  return (
    <div>
      <p className="mb-4 text-sm text-primary/70">
        ניתן להזין מספר בין {min} ל-{max}.
      </p>

      {/* The ring lives on the frame rather than the field, because the field is
          the whole bordered box as far as the eye is concerned. */}
      <div className="flex items-center gap-4 rounded-xl border border-primary/15 bg-white p-4 transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30">
        <Home className="size-6 shrink-0 text-primary" aria-hidden />
        <div className="h-8 w-px bg-primary/10" />
        <input
          type="number"
          inputMode="numeric"
          value={typed ?? String(value ?? current)}
          min={min}
          max={max}
          onChange={(e) => handleType(e.target.value)}
          onBlur={handleBlur}
          aria-label="שטח הבית במטרים רבועים"
          // Spinners removed: the slider below is the nudge-by-one affordance,
          // and the arrows crowd a number set at this size.
          className="w-full bg-transparent text-center text-4xl font-bold text-primary focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <span className="shrink-0 font-bold text-primary/70">מ״ר</span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={10}
        value={current}
        onChange={(e) => handleSlide(Number(e.target.value))}
        aria-label="בחירת שטח הבית"
        className="mt-6 w-full accent-primary"
      />
      <div className="mt-1 flex justify-between text-sm text-primary/70">
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
