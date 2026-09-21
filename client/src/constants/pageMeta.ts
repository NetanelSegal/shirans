import pageMetaJson from './pageMeta.json';

/**
 * Titles, descriptions and share images for the site's static pages.
 *
 * The data lives in pageMeta.json rather than here because two things read it:
 * each page at runtime, and the build step that writes a static HTML file per
 * route so link previews work. Link-preview crawlers (WhatsApp, Facebook,
 * Telegram) don't run JavaScript, so they never see what the page sets at
 * runtime — only what is in the HTML the server sends. One file keeps the two
 * from drifting apart.
 */

export interface PageMeta {
  title: string;
  description: string;
  /** Site-relative, e.g. "/og-calculator.jpg". Falls back to the default. */
  image?: string;
  imageAlt?: string;
}

export type StaticPagePath = keyof typeof pageMetaJson.pages;

export const SITE_NAME = pageMetaJson.siteName;
export const DEFAULT_SHARE_IMAGE = pageMetaJson.defaultImage;
export const DEFAULT_SHARE_IMAGE_ALT = pageMetaJson.defaultImageAlt;

export function getPageMeta(path: StaticPagePath): PageMeta {
  return pageMetaJson.pages[path];
}
