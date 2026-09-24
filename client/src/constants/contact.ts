import type { LineIconName } from '@/components/ui/LineIcon';

/**
 * How to reach Shiran — the one list the contact page, the contact band, the
 * footer and the calculator result all read, so a number or a handle changes in
 * one place.
 */

/** 052-5174443 in the international form WhatsApp expects. */
const WHATSAPP_NUMBER = '972525174443';

export const PHONE_DISPLAY = '052-5174443';
export const PHONE_HREF = 'tel:0525174443';
export const EMAIL = 'Studioimpact.shiran@gmail.com';

export function buildWhatsAppHref(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export interface ContactChannel {
  icon: LineIconName;
  label: string;
  href: string;
  /** Screen-reader name when the visible label alone is ambiguous. */
  ariaLabel?: string;
  external?: boolean;
}

export const SOCIAL_CHANNELS: ContactChannel[] = [
  {
    icon: 'facebook',
    label: 'Shiran_gilad',
    href: 'https://www.facebook.com/shiran.gilad.94',
    ariaLabel: 'שירן גלעד בפייסבוק',
    external: true,
  },
  {
    icon: 'instagram',
    label: 'Shiran_gilad',
    href: 'https://www.instagram.com/shiran_gilad/',
    ariaLabel: 'שירן גלעד באינסטגרם',
    external: true,
  },
];

export const CONTACT_CHANNELS: ContactChannel[] = [
  { icon: 'phone', label: PHONE_DISPLAY, href: PHONE_HREF, ariaLabel: `התקשרו ${PHONE_DISPLAY}` },
  { icon: 'mail', label: EMAIL, href: `mailto:${EMAIL}` },
  ...SOCIAL_CHANNELS,
];
