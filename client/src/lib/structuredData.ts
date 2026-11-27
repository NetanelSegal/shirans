import { BASE_URL } from '@/constants/urls';
import { EMAIL, PHONE_DISPLAY, SOCIAL_CHANNELS } from '@/constants/contact';
import { SITE_NAME } from '@/constants/pageMeta';
import { absoluteUrl, buildCanonicalUrl, DEFAULT_OG_IMAGE } from '@/constants/seo';

/**
 * schema.org JSON-LD builders: tell search engines in plain data what the site
 * is — an architecture and interior design studio serving the whole country —
 * and, per page, which service it describes and which questions it answers.
 *
 * Pure data, so the same objects feed the runtime <Helmet> tags
 * (components/Seo/StructuredData.tsx) and the HTML written at build time
 * (src/prerender). The business is one node with a stable @id; every page's
 * Service and breadcrumb point back to it instead of repeating it.
 */

export const BUSINESS_ID = `${BASE_URL}/#business`;

const ISRAEL = { '@type': 'Country', name: 'ישראל' };

const business = {
  '@type': 'ProfessionalService',
  '@id': BUSINESS_ID,
  name: SITE_NAME,
  alternateName: 'שירן גלעד אדריכלית ומעצבת פנים',
  description:
    'משרד לאדריכלות ועיצוב פנים לבתים פרטיים: תכנון בית פרטי, רישוי והיתרי בנייה, עיצוב פנים וייעוץ אדריכלי. 10 שנות ניסיון, עבודה בכל הארץ.',
  url: `${BASE_URL}/`,
  logo: absoluteUrl('/shiran_logo_icon.svg'),
  image: DEFAULT_OG_IMAGE,
  telephone: PHONE_DISPLAY,
  email: EMAIL,
  founder: { '@type': 'Person', name: 'שירן גלעד', jobTitle: 'אדריכלית ומעצבת פנים' },
  address: { '@type': 'PostalAddress', addressLocality: 'חריש', addressCountry: 'IL' },
  areaServed: ISRAEL,
  knowsAbout: [
    'תכנון בית פרטי',
    'אדריכלות לבנייה פרטית',
    'עיצוב פנים',
    'היתרי בנייה',
    'ייעוץ אדריכלי',
  ],
  sameAs: SOCIAL_CHANNELS.map((channel) => channel.href),
};

const website = {
  '@type': 'WebSite',
  '@id': `${BASE_URL}/#website`,
  url: `${BASE_URL}/`,
  name: SITE_NAME,
  inLanguage: 'he-IL',
  publisher: { '@id': BUSINESS_ID },
};

export type JsonLd = Record<string, unknown>;

const withContext = (data: JsonLd): JsonLd => ({ '@context': 'https://schema.org', ...data });

/** Site-wide: on every page. */
export const businessJsonLd = (): JsonLd => withContext({ '@graph': [business, website] });

export interface Crumb {
  name: string;
  path: string;
}

function breadcrumbList(crumbs: Crumb[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'דף הבית', path: '/' }, ...crumbs].map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: buildCanonicalUrl(crumb.path),
    })),
  };
}

export const breadcrumbJsonLd = (crumbs: Crumb[]): JsonLd => withContext(breadcrumbList(crumbs));

export interface ServiceJsonLdInput {
  name: string;
  description: string;
  path: string;
  faq: { question: string; answer: string }[];
}

/** A service page: the service itself, its place in the site, and its FAQ. */
export function serviceJsonLd({ name, description, path, faq }: ServiceJsonLdInput): JsonLd {
  const graph: JsonLd[] = [
    {
      '@type': 'Service',
      name,
      description,
      url: buildCanonicalUrl(path),
      provider: { '@id': BUSINESS_ID },
      areaServed: ISRAEL,
    },
    breadcrumbList([
      { name: 'שירותים', path: '/services' },
      { name, path },
    ]),
  ];
  if (faq.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: faq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    });
  }
  return withContext({ '@graph': graph });
}
