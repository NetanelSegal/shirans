import { Helmet } from 'react-helmet-async';
import {
  buildCanonicalUrl,
  DEFAULT_OG_IMAGE,
  OG_LOCALE,
} from '@/constants/seo';

interface PageSeoProps {
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
}

export default function PageSeo({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  noIndex = false,
}: PageSeoProps) {
  const canonicalUrl = buildCanonicalUrl(path);

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content={OG_LOCALE} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
