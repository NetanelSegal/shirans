import { useState, useEffect } from 'react';
import { calculatorService } from '@/services/calculator.service';
import {
  type CalculatorConfigInput,
  DEFAULT_CALCULATOR_CONFIG,
} from '@shirans/shared';
import { AdminPageHeader } from '@/components/Admin/AdminPageHeader';
import Button from '@/components/ui/Button';

export default function CalculatorConfigManagement() {
  const [config, setConfig] = useState<CalculatorConfigInput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    calculatorService
      .getConfig()
      .then((c) => setConfig(c))
      .catch(() => setConfig(null))
      .finally(() => setIsLoading(false));
  }, []);

  const updateConfig = (path: string, value: number) => {
    if (!config) return;
    const parts = path.split('.');
    const newConfig = JSON.parse(JSON.stringify(config)) as CalculatorConfigInput;
    let obj: Record<string, unknown> = newConfig;
    for (let i = 0; i < parts.length - 1; i++) {
      const key = parts[i];
      obj = obj[key] as Record<string, unknown>;
    }
    obj[parts[parts.length - 1]] = value;
    setConfig(newConfig);
  };

  const handleSave = async () => {
    if (!config) return;
    setIsSaving(true);
    setError(null);
    try {
      await calculatorService.updateConfig(config);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError((err as Error)?.message ?? 'שגיאה בשמירה');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setConfig(JSON.parse(JSON.stringify(DEFAULT_CALCULATOR_CONFIG)) as CalculatorConfigInput);
  };

  if (isLoading || !config) {
    return (
      <div className="flex min-h-[200px] items-center justify-center" dir="rtl">
        <span>טוען...</span>
      </div>
    );
  }

  return (
    <div dir="rtl" className="max-w-4xl">
      <AdminPageHeader title="הגדרות מחשבון אומדן" />
      {error && (
        <p className="mb-4 text-red-600" role="alert">
          {error}
        </p>
      )}
      {success && (
        <p className="mb-4 text-green-600" role="status">
          ההגדרות נשמרו בהצלחה
        </p>
      )}

      <div className="space-y-6 rounded-xl bg-white p-6 shadow">
        <section>
          <h3 className="mb-3 font-semibold">טווח שטח בנוי (מ״ר)</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="built-area-min" className="block text-sm font-medium">
                מינימום
              </label>
              <input
                id="built-area-min"
                type="number"
                value={config.builtAreaSqmRange.min}
                onChange={(e) =>
                  updateConfig('builtAreaSqmRange.min', Number(e.target.value))
                }
                className="mt-1 w-full rounded-lg border p-2"
              />
            </div>
            <div>
              <label htmlFor="built-area-max" className="block text-sm font-medium">
                מקסימום
              </label>
              <input
                id="built-area-max"
                type="number"
                value={config.builtAreaSqmRange.max}
                onChange={(e) =>
                  updateConfig('builtAreaSqmRange.max', Number(e.target.value))
                }
                className="mt-1 w-full rounded-lg border p-2"
              />
            </div>
          </div>
        </section>

        <section>
          <h3 className="mb-3 font-semibold">מחירי בסיס (₪/מ״ר)</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="construction-base-min" className="block text-sm font-medium">
                בנייה - מינימום
              </label>
              <input
                id="construction-base-min"
                type="number"
                value={config.constructionBase.min}
                onChange={(e) =>
                  updateConfig('constructionBase.min', Number(e.target.value))
                }
                className="mt-1 w-full rounded-lg border p-2"
              />
            </div>
            <div>
              <label htmlFor="construction-base-max" className="block text-sm font-medium">
                בנייה - מקסימום
              </label>
              <input
                id="construction-base-max"
                type="number"
                value={config.constructionBase.max}
                onChange={(e) =>
                  updateConfig('constructionBase.max', Number(e.target.value))
                }
                className="mt-1 w-full rounded-lg border p-2"
              />
            </div>
            <div>
              <label htmlFor="outdoor-base-min" className="block text-sm font-medium">
                פיתוח חוץ - מינימום
              </label>
              <input
                id="outdoor-base-min"
                type="number"
                value={config.outdoorBase.min}
                onChange={(e) =>
                  updateConfig('outdoorBase.min', Number(e.target.value))
                }
                className="mt-1 w-full rounded-lg border p-2"
              />
            </div>
            <div>
              <label htmlFor="outdoor-base-max" className="block text-sm font-medium">
                פיתוח חוץ - מקסימום
              </label>
              <input
                id="outdoor-base-max"
                type="number"
                value={config.outdoorBase.max}
                onChange={(e) =>
                  updateConfig('outdoorBase.max', Number(e.target.value))
                }
                className="mt-1 w-full rounded-lg border p-2"
              />
            </div>
          </div>
        </section>

        <section>
          <h3 className="mb-3 font-semibold">מכפיל מע״מ</h3>
          <div className="max-w-xs">
            <label htmlFor="vat-multiplier" className="block text-sm font-medium">
              מכפיל
            </label>
            <input
              id="vat-multiplier"
              type="number"
              step="0.01"
              value={config.vatMultiplier}
              onChange={(e) =>
                updateConfig('vatMultiplier', Number(e.target.value))
              }
              className="mt-1 w-full rounded-lg border p-2"
            />
          </div>
        </section>

        <section>
          <h3 className="mb-3 font-semibold">תוספות בריכה (₪)</h3>
          <div className="grid gap-4 md:grid-cols-4">
            {(['small', 'medium', 'large'] as const).map((size) => (
              <div key={size} className="space-y-2">
                <span className="text-sm font-medium">
                  {size === 'small' ? 'קטנה' : size === 'medium' ? 'בינונית' : 'גדולה'}
                </span>
                <div>
                  <label htmlFor={`pool-${size}-min`} className="sr-only">
                    {size === 'small' ? 'קטנה' : size === 'medium' ? 'בינונית' : 'גדולה'} מינימום
                  </label>
                  <input
                    id={`pool-${size}-min`}
                    type="number"
                    placeholder="מינ"
                    value={config.poolAddons[size].min}
                    onChange={(e) =>
                      updateConfig(
                        `poolAddons.${size}.min`,
                        Number(e.target.value)
                      )
                    }
                    className="w-full rounded-lg border p-2"
                  />
                </div>
                <div>
                  <label htmlFor={`pool-${size}-max`} className="sr-only">
                    {size === 'small' ? 'קטנה' : size === 'medium' ? 'בינונית' : 'גדולה'} מקסימום
                  </label>
                  <input
                    id={`pool-${size}-max`}
                    type="number"
                    placeholder="מקס"
                    value={config.poolAddons[size].max}
                    onChange={(e) =>
                      updateConfig(
                        `poolAddons.${size}.max`,
                        Number(e.target.value)
                      )
                    }
                    className="w-full rounded-lg border p-2"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-6 flex gap-4">
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? 'שומר...' : 'שמור הגדרות'}
        </Button>
        <Button variant="light" onClick={handleReset}>
          איפוס לברירת מחדל
        </Button>
      </div>
    </div>
  );
}
