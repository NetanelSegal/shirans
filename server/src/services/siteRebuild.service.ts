import logger from '../middleware/logger';

/**
 * Asks Netlify to rebuild the site.
 *
 * The client is a static SPA: link-preview crawlers (WhatsApp, Facebook) don't
 * run JavaScript, so each route's title, description and image come from an
 * HTML file written at build time. A freshly published article therefore has
 * no preview of its own until the site is rebuilt — this hook closes that gap.
 *
 * Fire-and-forget by design. A rebuild that fails must never fail the publish
 * that triggered it; the article is already saved, and the next deploy will
 * pick it up regardless.
 */
export function triggerSiteRebuild(reason: string): void {
  const hookUrl = process.env.NETLIFY_BUILD_HOOK_URL;
  if (!hookUrl) {
    logger.info('Site rebuild skipped: NETLIFY_BUILD_HOOK_URL is not set', { reason });
    return;
  }

  void fetch(hookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ trigger_title: reason }),
  })
    .then((response) => {
      if (response.ok) logger.info('Site rebuild triggered', { reason });
      else logger.warn('Site rebuild hook returned an error', { reason, status: response.status });
    })
    .catch((error) => logger.warn('Site rebuild hook unreachable', { reason, error }));
}
