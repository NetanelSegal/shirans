# SEO Brief

Received September 2026. This is the source of every public page's URL, `<title>`, meta description and H1. Titles and descriptions are implemented in [`client/src/constants/pageMeta.json`](../../client/src/constants/pageMeta.json); H1s live in each page's hero.

When changing any of these, change them here too, or record why they differ.

## Pages

| # | Page | URL | Meta Title | H1 | Key phrase |
|---|---|---|---|---|---|
| 1 | Home | `/` | שירן גלעד \| אדריכלות ועיצוב פנים לבתים פרטיים | אדריכלות ועיצוב פנים לבית שמרגיש בדיוק שלכם | אדריכלות ועיצוב פנים |
| 2 | About | `/about` | אודות שירן גלעד \| אדריכלות ועיצוב פנים | נעים להכיר, אני שירן גלעד | שירן גלעד אדריכלות ועיצוב פנים |
| 3 | Services | `/services` | שירותי אדריכלות ועיצוב פנים \| שירן גלעד | שירותי אדריכלות ועיצוב פנים | שירותי אדריכלות ועיצוב פנים |
| 4 | Private houses | `/private-house-architecture` | אדריכלות לבתים פרטיים \| תכנון בית פרטי – שירן גלעד | אדריכלות ותכנון בתים פרטיים ¹ | אדריכלות בתים פרטיים |
| 5 | Interior design | `/interior-design` | עיצוב פנים לבתים פרטיים \| שירן גלעד | עיצוב פנים לבתים פרטיים ¹ | עיצוב פנים לבתים פרטיים |
| 6 | Architectural consulting | `/architectural-consulting` | ייעוץ אדריכלי לפני בנייה ושיפוץ \| שירן גלעד | ייעוץ אדריכלי | ייעוץ אדריכלי |
| 7 | Online consulting | `/online-architecture-consulting` | ליווי וייעוץ אדריכלי אונליין \| שירן גלעד | ליווי אדריכלי אונליין ¹ | ייעוץ אדריכלי אונליין |
| 8 | Licensing & permits | `/architecture-permits` | תכנון אדריכלי, רישוי והיתרי בנייה \| שירן גלעד | אדריכלות, רישוי והיתרים | תכנון אדריכלי והיתר בנייה |
| 9 | Projects | `/projects` | פרויקטים באדריכלות ועיצוב פנים \| שירן גלעד | פרויקטים | פרויקטים אדריכלות ועיצוב פנים |
| 10 | Knowledge centre | `/blog` | מגזין אדריכלות, תכנון ועיצוב פנים \| שירן גלעד | תכנון, בנייה ועיצוב – כל מה שכדאי לדעת | תכנון בית פרטי |
| 11 | Contact | `/contact` | יצירת קשר \| שירן גלעד – אדריכלות ועיצוב פנים | בואו נדבר על הבית שלכם | שירן גלעד יצירת קשר |

¹ **The H1 on the site follows Shiran's page design rather than the brief:** "אדריכלות לבנייה פרטית", "עיצוב פנים", "ליווי אונליין". The brief's wording is a candidate for an SEO pass.

`/process` and `/calculator` are not in the brief and keep their earlier metadata.

## Implementation requirements

From the brief, with where each one stands.

| Requirement | Status |
|---|---|
| Title, description and H1 per page, per the table | ✅ Titles and descriptions in `pageMeta.json`; H1s in the page heroes |
| One H1 per page, then a logical H2/H3 hierarchy | ✅ Checked across the public pages |
| Stable, clean URLs; 301 redirects if an indexed URL changes | ✅ New pages have new URLs. No indexed URL changed — the old service anchors were `/services#…` fragments, which never reached the server |
| Editable Title, Description, slug, OG image per page | ⚠️ Per article: yes (admin). Static pages: in `pageMeta.json`, not in the admin |
| A distinct ALT for every meaningful image, describing what is visible | ✅ Site photos in `siteImages.ts`; articles have an ALT field |
| Images optimised (WebP/AVIF); lazy below the fold; hero not delayed | ✅ WebP in two widths; `<Photo priority>` for heroes |
| `sitemap.xml` and `robots.txt`; correct canonicals; no accidental `noindex` | ✅ The sitemap includes service pages and published articles; `noindex` only on deploy previews (Netlify's `X-Robots-Tag`), admin, auth, the calculator result and the 404 page |
| Google Search Console + GA4, sitemap submitted | ❌ Not done |
| Conversion events: form submit, phone click, WhatsApp click, main CTAs | ❌ Not done |
| Responsive; mobile performance and Core Web Vitals first | ✅ Mobile-first layout; no Lighthouse pass since the redesign |
| Structured data: BreadcrumbList on inner pages, Organization, Article | ⚠️ Articles emit `Article` + `BreadcrumbList` + `FAQPage`. Static pages have none yet |
| Correct Open Graph, so shares in WhatsApp/Facebook show the right card | ✅ A static HTML file per route at build time — see [Architecture](../04-Architecture/index.md#link-previews-static-share-pages) |
| All text, headings and links in crawlable HTML, not images | ✅ |
| A dynamic template for projects and articles, each with its own URL and editable H1, title, description, ALT, OG image | ⚠️ Articles: yes. Projects: own URL, but no per-project SEO fields in the admin |
