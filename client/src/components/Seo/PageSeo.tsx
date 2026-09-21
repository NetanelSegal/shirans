import { Helmet } from 'react-helmet-async';
import {
  absoluteUrl,
  buildCanonicalUrl,
  DEFAULT_OG_IMAGE,
  OG_LOCALE,
  SHARE_IMAGE_HEIGHT,
  SHARE_IMAGE_WIDTH,
} from '@/constants/seo';
import { DEFAULT_SHARE_IMAGE_ALT, SITE_NAME } from '@/constants/pageMeta';

interface PageSeoProps {
  title: string;
  description: string;
  path: string;
  /** Absolute or site-relative; must already be shaped 1200x630. */
  image?: string;
  imageAlt?: string;
  noIndex?: boolean;
}

/**
 * Runtime metadata, for the browser tab and for navigation within the app.
 *
 * Link previews do NOT come from here — crawlers don't run JavaScript. They
 * read the static HTML that scripts/generate-share-pages.mjs writes at build
 * time from the same pageMeta.json, with the same tags as below. Keep the two
 * tag sets matching.
 */
export default function PageSeo({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  imageAlt = DEFAULT_SHARE_IMAGE_ALT,
  noIndex = false,
}: PageSeoProps) {
  const canonicalUrl = buildCanonicalUrl(path);
  const imageUrl = absoluteUrl(image);

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content={String(SHARE_IMAGE_WIDTH)} />
      <meta property="og:image:height" content={String(SHARE_IMAGE_HEIGHT)} />
      <meta property="og:image:alt" content={imageAlt} />
      <meta property="og:locale" content={OG_LOCALE} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={imageAlt} />
    </Helmet>
  );
}
