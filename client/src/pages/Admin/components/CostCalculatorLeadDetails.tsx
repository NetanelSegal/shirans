import { X } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import type { CostCalculatorLeadResponse } from '@shirans/shared';
import { ShekelAmount } from '@/components/ui/ShekelAmount';
import { summarizeAnswers } from '@/utils/costCalculatorLeadSummary';

interface CostCalculatorLeadDetailsProps {
  lead: CostCalculatorLeadResponse | null;
  onClose: () => void;
}

/**
 * Nine answers don't fit in a table row, and they are the whole reason the lead
 * is interesting — the estimate alone says nothing about the house.
 */
export function CostCalculatorLeadDetails({
  lead,
  onClose,
}: CostCalculatorLeadDetailsProps) {
  return (
    <Modal
      open={!!lead}
      center
      onBackdropClick={onClose}
      containerClassName="w-[min(34rem,92vw)]"
    >
      {lead && (
        <div dir="rtl" className="rounded-panel bg-surface-raised p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-ink">{lead.name}</h2>
              <p className="mt-1 text-sm text-ink-muted">
                {new Date(lead.createdAt).toLocaleString('he-IL')}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="סגירה"
              className="rounded-card bg-transparent p-2 text-ink hover-capable:hover:scale-100 hover-capable:hover:bg-surface-sunken"
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm">
            <a href={`tel:${lead.phoneNumber}`} className="text-ink underline">
              {lead.phoneNumber}
            </a>
            <a href={`mailto:${lead.email}`} className="text-ink underline">
              {lead.email}
            </a>
          </div>

          <ShekelAmount
            value={lead.estimate}
            className="mt-5 block rounded-card bg-surface-sunken px-4 py-4 text-center text-xl font-bold text-ink"
          />

          <dl className="mt-5 divide-y divide-primary/10">
            {summarizeAnswers(lead).map(({ label, value }) => (
              <div key={label} className="flex justify-between gap-4 py-2.5">
                <dt className="text-sm text-ink-muted">{label}</dt>
                <dd className="text-sm font-bold text-ink">{value}</dd>
              </div>
            ))}
            <div className="flex justify-between gap-4 py-2.5">
              <dt className="text-sm text-ink-muted">אישור דיוור</dt>
              <dd className="text-sm font-bold text-ink">
                {lead.marketingConsent ? 'כן' : 'לא'}
              </dd>
            </div>
          </dl>
        </div>
      )}
    </Modal>
  );
}
