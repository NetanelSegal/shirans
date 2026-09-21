import {
  Armchair,
  Building2,
  CalendarDays,
  ClipboardCheck,
  Clock,
  Compass,
  DraftingCompass,
  Facebook,
  FileText,
  Gem,
  Heart,
  House,
  Instagram,
  Leaf,
  Linkedin,
  LucideIcon,
  Mail,
  MapPin,
  MessageCircle,
  Monitor,
  PencilRuler,
  Phone,
  Sofa,
} from 'lucide-react';
import { cn } from '@/lib/cn';

/**
 * Every icon the site draws, by what it means rather than what it depicts.
 * One stroke weight for all of them, so they read as one set — thin, like the
 * hairlines they sit beside.
 */
export const LINE_ICONS = {
  home: House,
  gem: Gem,
  heart: Heart,
  leaf: Leaf,
  armchair: Armchair,
  sofa: Sofa,
  building: Building2,
  monitor: Monitor,
  document: FileText,
  chat: MessageCircle,
  compass: Compass,
  drafting: DraftingCompass,
  pencilRuler: PencilRuler,
  checklist: ClipboardCheck,
  calendar: CalendarDays,
  clock: Clock,
  pin: MapPin,
  phone: Phone,
  mail: Mail,
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
} satisfies Record<string, LucideIcon>;

export type LineIconName = keyof typeof LINE_ICONS;

export function LineIcon({
  name,
  className,
  strokeWidth = 1.25,
}: {
  name: LineIconName;
  className?: string;
  strokeWidth?: number;
}) {
  const Icon = LINE_ICONS[name];
  return <Icon className={cn('size-7 shrink-0', className)} strokeWidth={strokeWidth} aria-hidden />;
}
