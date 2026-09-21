import { CalendarDays, Clock, MessageCircle, MonitorSmartphone, ShieldCheck } from 'lucide-react';
import Button from '@/components/ui/Button';
import { PHONE_HREF } from '../contactLinks';

const ASSURANCES = [
  { icon: Clock, label: '15-20 דקות של תשובות מדויקות' },
  { icon: MonitorSmartphone, label: 'בטלפון או בזום' },
  { icon: ShieldCheck, label: 'ללא התחייבות — רק שיחה מקצועית' },
];

interface ContactCtaSectionProps {
  title: string;
  subtitle: string;
  /** Carries the visitor's answers and a link to their lead — see whatsappMessage. */
  whatsappHref: string;
}

export function ContactCtaSection({
  title,
  subtitle,
  whatsappHref,
}: ContactCtaSectionProps) {
  return (
    <div>
      <h2 className="text-h3 font-bold text-ink">{title}</h2>
      <p className="mt-3 text-ink-muted">{subtitle}</p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <a
          href={whatsappHref}
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
        <a href={PHONE_HREF} className="w-full sm:w-auto">
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
          <li key={label} className="flex items-center gap-2 text-sm text-ink-muted">
            <Icon className="size-4 shrink-0" aria-hidden />
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}
