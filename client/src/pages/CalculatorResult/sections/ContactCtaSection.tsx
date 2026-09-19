import { CalendarDays, Clock, MessageCircle, MonitorSmartphone, ShieldCheck } from 'lucide-react';
import Button from '@/components/ui/Button';

/** 052-5174443 in the international form WhatsApp expects. */
const WHATSAPP_URL = 'https://wa.me/972525174443';
const WHATSAPP_MESSAGE = encodeURIComponent(
  'היי שירן, קיבלתי הערכה במחשבון עלות הבית ואשמח לדבר על הפרויקט שלי.',
);

const ASSURANCES = [
  { icon: Clock, label: '15–20 דקות של תשובות מדויקות' },
  { icon: MonitorSmartphone, label: 'בזום או במשרד' },
  { icon: ShieldCheck, label: 'ללא התחייבות — רק שיחה מקצועית' },
];

interface ContactCtaSectionProps {
  title: string;
  subtitle: string;
}

export function ContactCtaSection({ title, subtitle }: ContactCtaSectionProps) {
  return (
    <div>
      <h2 className="subheading font-bold text-primary">{title}</h2>
      <p className="mt-3 text-primary/70">{subtitle}</p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <a
          href={`${WHATSAPP_URL}?text=${WHATSAPP_MESSAGE}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto"
        >
          <Button
            variant="primary"
            className="flex w-full items-center justify-center gap-2 whitespace-nowrap py-3 sm:px-8"
          >
            <MessageCircle className="size-5 shrink-0" aria-hidden />
            שליחת הודעה בוואטסאפ
          </Button>
        </a>
        <a href="tel:0525174443" className="w-full sm:w-auto">
          <Button
            variant="secondary"
            className="flex w-full items-center justify-center gap-2 whitespace-nowrap py-3 sm:px-8"
          >
            <CalendarDays className="size-5 shrink-0" aria-hidden />
            לתיאום שיחה
          </Button>
        </a>
      </div>

      <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
        {ASSURANCES.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-2 text-sm text-primary/70">
            <Icon className="size-4 shrink-0" aria-hidden />
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}
