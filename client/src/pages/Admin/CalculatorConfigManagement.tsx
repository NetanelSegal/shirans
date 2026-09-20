import { useEffect, useState } from 'react';
import {
  DEFAULT_COST_CALCULATOR_CONFIG,
  costCalculatorConfigSchema,
} from '@shirans/shared';
import type { CostCalculatorConfig } from '@shirans/shared';
import { AdminPageHeader } from '@/components/Admin/AdminPageHeader';
import { ErrorState, LoadingState } from '@/components/DataState';
import Button from '@/components/ui/Button';
import { useAdminCalculatorConfig } from '@/hooks/admin/useAdminCalculatorConfig';
import { setByPath } from '@/utils/objectPath';
import { COST_CALCULATOR_CONFIG_GROUPS } from './costCalculatorConfigFields';
import { ConfigEstimatePreview } from './components/ConfigEstimatePreview';
import { ConfigGroupSection } from './components/ConfigGroupSection';

export default function CalculatorConfigManagement() {
  const { savedConfig, isSettled, loadError, refresh, save, isSaving, saveError } =
    useAdminCalculatorConfig();

  const [draft, setDraft] = useState<CostCalculatorConfig | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);

  // Seeded once the server has actually answered, and never again — re-seeding
  // would throw away edits in progress.
  useEffect(() => {
    if (isSettled) setDraft((current) => current ?? savedConfig);
  }, [isSettled, savedConfig]);

  const handleChange = (path: string, value: number) => {
    setJustSaved(false);
    setValidationError(null);
    setDraft((current) => (current ? setByPath(current, path, value) : current));
  };

  const handleSave = async () => {
    if (!draft) return;

    // Checked here as well as on the server, so a typo comes back as the field
    // that is wrong rather than as a rejected request.
    const parsed = costCalculatorConfigSchema.safeParse(draft);
    if (!parsed.success) {
      setValidationError(
        parsed.error.issues
          .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
          .join(' · '),
      );
      return;
    }

    setValidationError(null);
    try {
      await save(parsed.data);
      setJustSaved(true);
    } catch {
      // Surfaced through saveError.
    }
  };

  const message = validationError ?? saveError;

  if (loadError) {
    return (
      <div dir="rtl">
        <AdminPageHeader title="הגדרות המחשבון" />
        <ErrorState message={loadError} onRetry={refresh} />
      </div>
    );
  }

  return (
    <div dir="rtl">
      {/* The header renders before the data does, so the screen never looks
          like it failed to load. */}
      <AdminPageHeader title="הגדרות המחשבון" />

      {!draft ? (
        <LoadingState minHeight="20rem" />
      ) : (
        <div className="space-y-6">
          <ConfigEstimatePreview config={draft} />

          {COST_CALCULATOR_CONFIG_GROUPS.map((group) => (
            <ConfigGroupSection
              key={group.title}
              group={group}
              config={draft}
              onChange={handleChange}
            />
          ))}

          {message && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">
              {message}
            </p>
          )}
          {justSaved && !message && (
            <p className="text-sm font-bold text-green-700" role="status">
              ההגדרות נשמרו.
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <Button variant="primary" onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'שומר...' : 'שמירת הגדרות'}
            </Button>
            <Button
              variant="light"
              onClick={() => {
                setJustSaved(false);
                setValidationError(null);
                setDraft(DEFAULT_COST_CALCULATOR_CONFIG);
              }}
            >
              איפוס לברירת מחדל
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
