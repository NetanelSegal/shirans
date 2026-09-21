/**
 * Writes a static HTML file per route with its link-preview tags baked in.
 *
 * Why this exists: WhatsApp, Facebook, Telegram, LinkedIn and X build a link
 * preview from the HTML the server returns, and none of them run JavaScript.
 * This is a single-page app, so every route used to return the same bare
 * index.html — no title, no description, no image — and the tags the pages set
 * at runtime never reached a crawler. Every shared link showed as a plain URL.
 *
 * Runs after `vite build`. For each route it copies dist/index.html to
 * dist/<route>.html with that route's tags in <head>. Netlify serves an
 * existing file before applying the `/* /index.html 200` fallback, so a crawler
 * gets the right tags and a browser gets the same app as before.
 *
 * Tags carry `data-rh="true"`, the marker react-helmet-async uses for tags it
 * owns, so at runtime it replaces them instead of adding duplicates.
 *
 * The page copy comes from src/constants/pageMeta.json — the same file the
 * pages read — so a preview can't disagree with the page it links to.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
// @shirans/shared is built to CommonJS; load it the way Node expects.
const {
  cloudinaryShareImageUrl,
  getMainImageUrl,
  normalizeProjectResponse,
  SHARE_IMAGE_WIDTH,
  SHARE_IMAGE_HEIGHT,
} = require('@shirans/shared');

const __dirname = dirname(fileURLToPath(import.meta.url));
const CLIENT_DIR = join(__dirname, '..');
const DIST_DIR = join(CLIENT_DIR, 'dist');
const META = JSON.parse(
  readFileSync(join(CLIENT_DIR, 'src', 'constants', 'pageMeta.json'), 'utf8'),
);

const BASE_URL = 'https://shiran-gilad.com';
const OG_LOCALE = 'he_IL';
const PROJECTS_API_URL =
  process.env.SHARE_PAGES_API_URL ??
  'https://server-production-a5a6.up.railway.app/api/projects';

const log = (message) => console.log(`[share-pages] ${message}`);

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function absoluteUrl(pathOrUrl) {
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;
  return `${BASE_URL}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;
}

function canonicalUrl(path) {
  return path === '/' ? `${BASE_URL}/` : `${BASE_URL}${path}`;
}

/** Mirrors components/Seo/PageSeo.tsx — keep the two tag sets matching. */
function buildHead({ path, title, description, image, imageAlt, noIndex }) {
  const url = canonicalUrl(path);
  const imageUrl = absoluteUrl(image ?? META.defaultImage);
  const alt = imageAlt ?? META.defaultImageAlt;
  const tag = (html) => `    ${html}`;
  const meta = (attr, key, content) =>
    tag(`<meta ${attr}="${key}" content="${escapeAttr(content)}" data-rh="true" />`);

  return [
    tag(`<title>${escapeAttr(title)}</title>`),
    meta('name', 'description', description),
    tag(`<link rel="canonical" href="${escapeAttr(url)}" data-rh="true" />`),
    ...(noIndex ? [meta('name', 'robots', 'noindex, nofollow')] : []),
    meta('property', 'og:site_name', META.siteName),
    meta('property', 'og:title', title),
    meta('property', 'og:description', description),
    meta('property', 'og:type', 'website'),
    meta('property', 'og:url', url),
    meta('property', 'og:image', imageUrl),
    meta('property', 'og:image:width', SHARE_IMAGE_WIDTH),
    meta('property', 'og:image:height', SHARE_IMAGE_HEIGHT),
    meta('property', 'og:image:alt', alt),
    meta('property', 'og:locale', OG_LOCALE),
    meta('name', 'twitter:card', 'summary_large_image'),
    meta('name', 'twitter:title', title),
    meta('name', 'twitter:description', description),
    meta('name', 'twitter:image', imageUrl),
    meta('name', 'twitter:image:alt', alt),
  ].join('\n');
}

/**
 * `/calculator` is written as `calculator.html`, not `calculator/index.html`.
 * Netlify serves `/calculator` straight from `calculator.html`, but a folder
 * with an index makes it 301 to `/calculator/` — an extra round trip for every
 * visitor and a changed URL on every existing link, including the lead links
 * in Shiran's alerts. Found on the deploy preview; `vite preview` hid it.
 */
function writeRoute(template, page) {
  const html = template.replace('</head>', `${buildHead(page)}\n  </head>`);
  const file =
    page.path === '/'
      ? join(DIST_DIR, 'index.html')
      : join(DIST_DIR, `${page.path.slice(1)}.html`);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html, 'utf8');
}

/**
 * Project pages get their own title, description and photo. If the API can't
 * be reached the build still succeeds: those routes fall back to index.html,
 * which carries the site-wide preview — a generic card, not a blank one.
 */
async function fetchProjectPages() {
  try {
    const response = await fetch(PROJECTS_API_URL, {
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) throw new Error(`API responded with ${response.status}`);
    const payload = await response.json();
    if (!Array.isArray(payload)) throw new Error('API response is not an array');

    return payload
      .map(normalizeProjectResponse)
      .filter((project) => project?.id && project?.title)
      .map((project) => {
        const firstParagraph = String(project.description ?? '').split('\n')[0];
        const imageUrl = cloudinaryShareImageUrl(getMainImageUrl(project.media));
        return {
          path: `/projects/${project.id}`,
          // Same wording as pages/Project/Project.tsx.
          title: `${project.title} - שירן גלעד אדריכלות ועיצוב פנים`,
          description:
            firstParagraph.length > 160
              ? `${firstParagraph.substring(0, 160)}...`
              : firstParagraph,
          image: imageUrl || undefined,
          imageAlt: project.title,
        };
      });
  } catch (error) {
    console.warn(`[share-pages] Projects API unavailable (${error.message}); project routes use the site-wide preview.`);
    return [];
  }
}

async function main() {
  const template = readFileSync(join(DIST_DIR, 'index.html'), 'utf8');
  if (template.includes('property="og:title"')) {
    throw new Error('dist/index.html already has preview tags — was this run twice?');
  }

  const projectPages = await fetchProjectPages();

  const staticPages = Object.entries(META.pages).map(([path, page]) => ({
    path,
    ...page,
  }));

  // The projects index leads with its first project's photo at runtime
  // (pages/Projects/Projects.tsx); the preview should show the same one.
  const projectsIndex = staticPages.find((page) => page.path === '/projects');
  if (projectsIndex && projectPages[0]?.image) {
    projectsIndex.image = projectPages[0].image;
    projectsIndex.imageAlt = projectPages[0].imageAlt;
  }

  // A shared result link can't show the sender's estimate — it lives in their
  // browser session — so the recipient lands on the calculator. The preview
  // should say so, and stay out of search results.
  const calculator = META.pages['/calculator'];
  const resultPage = { path: '/calculator/result', ...calculator, noIndex: true };

  // Written last: dist/index.html is also the fallback for every route without
  // its own file, so the template must stay untouched until the others exist.
  const home = staticPages.find((page) => page.path === '/');
  const others = [
    ...staticPages.filter((page) => page.path !== '/'),
    resultPage,
    ...projectPages,
  ];

  for (const page of others) writeRoute(template, page);
  writeRoute(template, home);

  log(
    `Wrote ${others.length + 1} pages: ${staticPages.length} static, 1 result, ${projectPages.length} projects.`,
  );
}

main().catch((error) => {
  console.error('[share-pages] Failed:', error);
  process.exit(1);
});
