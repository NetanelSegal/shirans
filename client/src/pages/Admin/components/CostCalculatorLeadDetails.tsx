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
        <div dir="rtl" className="rounded-2xl bg-white p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-primary">{lead.name}</h2>
              <p className="mt-1 text-sm text-primary/70">
                {new Date(lead.createdAt).toLocaleString('he-IL')}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="סגירה"
              className="rounded-lg bg-transparent p-2 text-primary hover-capable:hover:scale-100 hover-capable:hover:bg-secondary"
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm">
            <a href={`tel:${lead.phoneNumber}`} className="text-primary underline">
              {lead.phoneNumber}
            </a>
            <a href={`mailto:${lead.email}`} className="text-primary underline">
              {lead.email}
            </a>
          </div>

          <ShekelAmount
            value={lead.estimate}
            className="mt-5 block rounded-xl bg-secondary px-4 py-4 text-center text-xl font-bold text-primary"
          />

          <dl className="mt-5 divide-y divide-primary/10">
            {summarizeAnswers(lead).map(({ label, value }) => (
              <div key={label} className="flex justify-between gap-4 py-2.5">
                <dt className="text-sm text-primary/70">{label}</dt>
                <dd className="text-sm font-bold text-primary">{value}</dd>
              </div>
            ))}
            <div className="flex justify-between gap-4 py-2.5">
              <dt className="text-sm text-primary/70">אישור דיוור</dt>
              <dd className="text-sm font-bold text-primary">
                {lead.marketingConsent ? 'כן' : 'לא'}
              </dd>
            </div>
          </dl>
        </div>
      )}
    </Modal>
  );
}
