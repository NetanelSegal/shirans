import { envConfig, isPreviewDeploy } from '@/config/env';

/**
 * Site measurement for Google Ads: loads Google Tag Manager or a GA4 tag, and
 * reports a lead when a visitor's form actually goes through.
 *
 * Nothing loads unless an ID is set in the env (see client/.env.example), and
 * never on a preview deploy, so test visits don't count as traffic or leads.
 * With a GTM container the conversions are wired up inside GTM; with a GA4 ID
 * alone the lead event is sent straight to GA4 (and to Google Ads, if its
 * conversion ID and label are set too).
 */

/** The event name Google uses for a lead, in both GA4 and GTM. */
const LEAD_EVENT = 'generate_lead';

export type LeadSource = 'contact_form' | 'cost_calculator';

type DataLayerEntry = Record<string, unknown> | IArguments;

declare global {
  interface Window {
    dataLayer?: DataLayerEntry[];
    gtag?: (...args: unknown[]) => void;
  }
}

let started = false;

function isEnabled(): boolean {
  const { gtmId, ga4Id } = envConfig.analytics;
  return !isPreviewDeploy && !!(gtmId || ga4Id);
}

function loadScript(src: string): void {
  const script = document.createElement('script');
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

function startGtm(gtmId: string): void {
  window.dataLayer!.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
  loadScript(`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`);
}

function startGtag(tagIds: string[]): void {
  // gtag must push `arguments` itself, not an array: that is the shape gtag.js reads.
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag('js', new Date());
  tagIds.forEach((id) => window.gtag!('config', id));
  loadScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(tagIds[0])}`);
}

/** Call once at startup. Safe to call when nothing is configured. */
export function initAnalytics(): void {
  if (started || !isEnabled()) return;
  started = true;

  window.dataLayer = window.dataLayer ?? [];
  const { gtmId, ga4Id, adsId } = envConfig.analytics;

  if (gtmId) {
    startGtm(gtmId);
    return;
  }
  startGtag([ga4Id, adsId].filter(Boolean));
}

/**
 * Report a lead. Call only after the form was really received, never on
 * click or on a failed send, so Google Ads counts real leads only.
 */
export function trackLead(source: LeadSource): void {
  if (!isEnabled()) return;
  const { gtmId, adsId, adsLeadLabel } = envConfig.analytics;

  if (gtmId) {
    window.dataLayer?.push({ event: LEAD_EVENT, lead_source: source });
    return;
  }

  window.gtag?.('event', LEAD_EVENT, { lead_source: source });
  if (adsId && adsLeadLabel) {
    window.gtag?.('event', 'conversion', { send_to: `${adsId}/${adsLeadLabel}` });
  }
}
