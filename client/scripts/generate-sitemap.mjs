import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, '..', 'public');
const SITEMAP_PATH = join(PUBLIC_DIR, 'sitemap.xml');

const BASE_URL = 'https://shiran-gilad.com';
const DEFAULT_API_URL = 'https://server-production-a5a6.up.railway.app/api/projects';
const API_URL = process.env.SITEMAP_API_URL ?? DEFAULT_API_URL;

const STATIC_PAGES = [
  { path: '/', priority: '1.0' },
  { path: '/process', priority: '0.8' },
  { path: '/projects', priority: '0.9' },
  { path: '/about', priority: '0.8' },
  { path: '/contact', priority: '0.7' },
  { path: '/calculator', priority: '0.8' },
];

const today = new Date().toISOString().slice(0, 10);

function extractProjectIdsFromSitemap(xml) {
  const matches = [...xml.matchAll(/<loc>https:\/\/shiran-gilad\.com\/projects\/([^<]+)<\/loc>/g)];
  return matches.map((match) => match[1]);
}

async function fetchProjectIds() {
  try {
    const response = await fetch(API_URL, {
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`API responded with ${response.status}`);
    }

    const projects = await response.json();
    if (!Array.isArray(projects)) {
      throw new Error('API response is not an array');
    }

    const ids = projects
      .map((project) => project?.id)
      .filter((id) => typeof id === 'string' && id.length > 0);

    if (ids.length === 0) {
      throw new Error('API returned no project IDs');
    }

    console.log(`[sitemap] Fetched ${ids.length} project IDs from ${API_URL}`);
    return ids;
  } catch (error) {
    console.warn(`[sitemap] API fetch failed: ${error.message}`);
    return null;
  }
}

function buildUrlEntry(loc, priority, changefreq = 'monthly') {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

async function main() {
  let projectIds = await fetchProjectIds();

  if (!projectIds) {
    try {
      const existing = readFileSync(SITEMAP_PATH, 'utf8');
      projectIds = extractProjectIdsFromSitemap(existing);
      console.log(
        `[sitemap] Using ${projectIds.length} project IDs from existing sitemap`,
      );
    } catch {
      projectIds = [];
      console.warn('[sitemap] No fallback project IDs available');
    }
  }

  const staticEntries = STATIC_PAGES.map(({ path, priority }) =>
    buildUrlEntry(`${BASE_URL}${path === '/' ? '/' : path}`, priority),
  );

  const projectEntries = projectIds.map((id) =>
    buildUrlEntry(`${BASE_URL}/projects/${id}`, '0.6'),
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static Pages -->
${staticEntries.join('\n')}

  <!-- Dynamic Project Pages -->
${projectEntries.join('\n')}
</urlset>
`;

  writeFileSync(SITEMAP_PATH, xml, 'utf8');
  console.log(
    `[sitemap] Wrote ${STATIC_PAGES.length + projectIds.length} URLs to ${SITEMAP_PATH}`,
  );
}

main().catch((error) => {
  console.error('[sitemap] Generation failed:', error);
  process.exit(1);
});
