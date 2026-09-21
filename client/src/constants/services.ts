import type { LineIconName } from '@/components/ui/LineIcon';
import { SITE_IMAGES, SiteImage } from './siteImages';

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: LineIconName;
  image: SiteImage;
}

/**
 * What Shiran offers — the one list the home page, About and the services page
 * all render, so a service is added or reworded in one place.
 */
export const SERVICES: Service[] = [
  {
    id: 'private-construction',
    title: 'בנייה פרטית',
    description: 'רישוי מלא תכנון ואדריכלות',
    icon: 'home',
    image: SITE_IMAGES.servicePrivate,
  },
  {
    id: 'residential-design',
    title: 'עיצוב פנים',
    description: 'ליווי מלא לעיצוב בתים פרטיים',
    icon: 'armchair',
    image: SITE_IMAGES.serviceResidential,
  },
  {
    id: 'luxury-design',
    title: 'דירות יוקרה',
    description: 'עיצוב וליווי מלא לפנטהאוזים ודירות יוקרה',
    icon: 'gem',
    image: SITE_IMAGES.serviceLuxury,
  },
  {
    id: 'commercial-design',
    title: 'עיצוב מסחרי',
    description: 'אדריכלות ועיצוב פנים לחללים מסחריים',
    icon: 'building',
    image: SITE_IMAGES.serviceCommercial,
  },
  {
    id: 'licensing',
    title: 'תהליך רישוי',
    description: 'ליווי מלא בתהליכי רישוי ולגליזציה',
    icon: 'document',
    image: SITE_IMAGES.serviceLicensing,
  },
  {
    id: 'consulting',
    title: 'ייעוץ מקצועי',
    description: 'ייעוץ מקצועי בתחומי אדריכלות ועיצוב פנים',
    icon: 'chat',
    image: SITE_IMAGES.serviceConsulting,
  },
];
