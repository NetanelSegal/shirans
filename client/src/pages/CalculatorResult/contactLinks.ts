/**
 * One source for the two ways to reach Shiran from the result page, so the
 * closing block and the floating bar can never drift apart.
 */

/** 052-5174443 in the international form WhatsApp expects. */
const WHATSAPP_NUMBER = '972525174443';

export const PHONE_HREF = 'tel:0525174443';

export function buildWhatsAppHref(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
