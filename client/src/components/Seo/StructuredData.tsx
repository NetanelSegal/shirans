import { Helmet } from 'react-helmet-async';
import {
  breadcrumbJsonLd,
  businessJsonLd,
  serviceJsonLd,
  type Crumb,
  type JsonLd,
  type ServiceJsonLdInput,
} from '@/lib/structuredData';

/**
 * Runtime JSON-LD tags. The data comes from lib/structuredData.ts, which the
 * build-time HTML (src/prerender) reads too, so the two can't disagree.
 */
function JsonLdTag({ data }: { data: JsonLd }) {
  return (
    <Helmet>
      <script type='application/ld+json'>{JSON.stringify(data)}</script>
    </Helmet>
  );
}

/** Site-wide: rendered once, from the layout. */
export function BusinessStructuredData() {
  return <JsonLdTag data={businessJsonLd()} />;
}

export function BreadcrumbStructuredData({ crumbs }: { crumbs: Crumb[] }) {
  return <JsonLdTag data={breadcrumbJsonLd(crumbs)} />;
}

export function ServiceStructuredData(props: ServiceJsonLdInput) {
  return <JsonLdTag data={serviceJsonLd(props)} />;
}
