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
 * existing file before applying the rules in public/_redirects, so a crawler
 * gets the right tags and a browser gets the same app as before.
 *
 * Search engines get more than tags: each file also carries the page's text
 * inside <div id="root"> and its schema.org JSON-LD in <head>, both from
 * src/prerender/entry.tsx (see there). It also writes 404.html, served with a
 * 404 status for any URL that isn't a page.
 *
 * Tags carry `data-rh="true"`, the marker react-helmet-async uses for tags it
 * owns, so at runtime it replaces them instead of adding duplicates.
 *
 * The page copy comes from src/constants/pageMeta.json — the same file the
 * pages read — so a preview can't disagree with the page it links to.
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
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
const API_ORIGIN =
  process.env.SHARE_PAGES_API_ORIGIN ??
  'https://server-production-a5a6.up.railway.app';
const PROJECTS_API_URL = process.env.SHARE_PAGES_API_URL ?? `${API_ORIGIN}/api/projects`;
const ARTICLES_API_URL = `${API_ORIGIN}/api/articles/published`;

const log = (message) => console.log(`[share-pages] ${message}`);

/**
 * The page text for crawlers, rendered from src/prerender/entry.tsx (built by
 * `vite build --ssr` into dist-prerender). Without it the pages still build,
 * with the link-preview tags only.
 */
const PRERENDER_ENTRY = join(CLIENT_DIR, 'dist-prerender', 'entry.js');
async function loadPrerender() {
  if (!existsSync(PRERENDER_ENTRY)) {
    console.warn('[share-pages] dist-prerender/entry.js not found; pages get preview tags only.');
    return null;
  }
  return import(pathToFileURL(PRERENDER_ENTRY).href);
}

/** `<` escaped so article text can never close the script tag early. */
const jsonForScript = (data) => JSON.stringify(data).replace(/</g, '\\u003c');

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
  const { prerendered } = page;
  // Marked like the meta tags, so react-helmet-async replaces them at runtime
  // instead of adding its own copies beside them.
  const jsonLd = (prerendered?.jsonLd ?? []).map(
    (data) => `    <script type="application/ld+json" data-rh="true">${jsonForScript(data)}</script>`,
  );
  let html = template.replace('</head>', `${[buildHead(page), ...jsonLd].join('\n')}\n  </head>`);
  if (prerendered?.html) {
    if (!html.includes('<div id="root"></div>')) {
      throw new Error('dist/index.html has no empty <div id="root"></div> to fill.');
    }
    html = html.replace('<div id="root"></div>', () => `<div id="root">${prerendered.html}</div>`);
  }
  /*
   * `filePath` exists for Hebrew slugs. A canonical URL has to be
   * percent-encoded, but the server decodes the request path before it looks
   * for a file — so a file named "%D7%9B….html" is never found and the route
   * falls back to index.html carrying the home page's preview tags. The file is
   * therefore written under the raw characters while the tags keep the encoded
   * URL. Caught on `vite preview`, which serves the same way Netlify does.
   */
  const diskPath = page.filePath ?? page.path;
  const file =
    diskPath === '/'
      ? join(DIST_DIR, 'index.html')
      : join(DIST_DIR, `${diskPath.slice(1)}.html`);
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
          summary: {
            id: project.id,
            title: project.title,
            description: project.description,
            imageUrl: imageUrl || undefined,
          },
        };
      });
  } catch (error) {
    console.warn(`[share-pages] Projects API unavailable (${error.message}); project routes use the site-wide preview.`);
    return [];
  }
}

/**
 * Each published article gets its own HTML file, so a link shared in WhatsApp
 * shows that article's title, excerpt and cover rather than the site-wide card.
 * This is why publishing from the admin triggers a rebuild — see
 * server/src/services/siteRebuild.service.ts.
 */
async function fetchArticlePages() {
  try {
    const response = await fetch(ARTICLES_API_URL, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`API responded with ${response.status}`);
    const payload = await response.json();
    if (!Array.isArray(payload)) throw new Error('API response is not an array');

    return payload
      .filter((article) => article?.slug && article?.title)
      .map((article) => {
        const plain = String(article.excerpt ?? '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        return {
          // Encoded for the canonical and og:url tags…
          path: `/blog/${encodeURIComponent(article.slug)}`,
          // …but written to disk under the raw slug the server will look up.
          filePath: `/blog/${article.slug}`,
          title: article.seoTitle || `${article.title} | ${META.siteName}`,
          description: (article.seoDescription || plain).slice(0, 160),
          image: article.coverImage || undefined,
          imageAlt: article.coverImageAlt || article.title,
          summary: { slug: article.slug, title: article.title, excerpt: article.excerpt },
        };
      });
  } catch (error) {
    console.warn(`[share-pages] Articles API unavailable (${error.message}); article routes use the site-wide preview.`);
    return [];
  }
}

/** The list endpoint has no bodies, so each published article is fetched by slug. */
async function attachArticleBodies(articlePages) {
  await Promise.all(
    articlePages.map(async (page) => {
      try {
        const url = `${API_ORIGIN}/api/articles/slug/${encodeURIComponent(page.summary.slug)}`;
        const response = await fetch(url, { headers: { Accept: 'application/json' } });
        if (!response.ok) throw new Error(`API responded with ${response.status}`);
        const article = await response.json();
        page.summary.body = article.body ?? '';
      } catch (error) {
        console.warn(`[share-pages] Body of "${page.summary.slug}" unavailable (${error.message}).`);
      }
    }),
  );
}

async function main() {
  const template = readFileSync(join(DIST_DIR, 'index.html'), 'utf8');
  if (template.includes('property="og:title"')) {
    throw new Error('dist/index.html already has preview tags — was this run twice?');
  }

  const [projectPages, articlePages] = await Promise.all([
    fetchProjectPages(),
    fetchArticlePages(),
  ]);

  const staticPages = Object.entries(META.pages).map(([path, page]) => ({
    path,
    ...page,
  }));

  const prerender = await loadPrerender();
  if (prerender) {
    await attachArticleBodies(articlePages);
    const byPath = new Map(prerender.staticPages().map((p) => [p.path, p]));
    byPath.set('/projects', prerender.projectsIndexPage(projectPages.map((p) => p.summary)));
    byPath.set('/blog', prerender.blogIndexPage(articlePages.map((p) => p.summary)));
    for (const page of staticPages) page.prerendered = byPath.get(page.path);
    for (const page of projectPages) page.prerendered = prerender.projectPage(page.summary);
    for (const page of articlePages) page.prerendered = prerender.articlePage(page.summary);
    const missing = staticPages.filter((p) => !p.prerendered).map((p) => p.path);
    log(`Prerendered page text${missing.length ? `; none for ${missing.join(', ')}` : ' for every page'}.`);
  }

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
    ...articlePages,
  ];

  // Served with a real 404 status for any URL that is not a page (see public/_redirects),
  // so search engines drop dead links instead of indexing them as copies of the home page.
  const notFound = {
    path: '/404',
    title: '404 - דף לא נמצא | שירן גלעד אדריכלות ועיצוב פנים',
    description: 'הדף שביקשת לא נמצא. חזור לעמוד הבית או עיין בפרויקטים שלנו.',
    noIndex: true,
  };
  writeRoute(template, notFound);

  for (const page of others) writeRoute(template, page);
  writeRoute(template, home);

  log(
    `Wrote ${others.length + 1} pages: ${staticPages.length} static, 1 result, ${projectPages.length} projects, ${articlePages.length} articles.`,
  );
}

main().catch((error) => {
  console.error('[share-pages] Failed:', error);
  process.exit(1);
});
