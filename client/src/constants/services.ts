import type { LineIconName } from '@/components/ui/LineIcon';
import { SERVICE_PAGES } from '@/data/service-pages';
import type { SiteImage } from './siteImages';

export interface Service {
  /** The slug of the service's own page; also its anchor id. */
  id: string;
  /** Where the card links. */
  href: string;
  title: string;
  description: string;
  icon: LineIconName;
  image: SiteImage;
}

/**
 * What Shiran offers — the one list the home page, About and the services page
 * all render. It is derived from the service pages themselves, so a service
 * and the page behind it can never disagree about its name, photo or URL.
 */
export const SERVICES: Service[] = SERVICE_PAGES.map((page) => ({
  id: page.slug,
  href: `/${page.slug}`,
  title: page.cardTitle ?? page.title,
  description: page.cardDescription,
  icon: page.icon,
  image: page.cardImage,
}));
