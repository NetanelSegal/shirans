import { SERVICE_PAGES } from '@/data/service-pages';

/** The site's main navigation, in reading order. Navbar and footer both render it. */
export const NAV_ITEMS = [
  { label: 'עמוד הבית', to: '/' },
  { label: 'אודות', to: '/about' },
  { label: 'שירותים', to: '/services' },
  { label: 'התהליך', to: '/process' },
  { label: 'פרויקטים', to: '/projects' },
  { label: 'מרכז הידע', to: '/blog' },
  { label: 'צור קשר', to: '/contact' },
] as const;

/**
 * Pages that open with a full-bleed photo. The navbar floats transparent over
 * it and the page starts at the very top; elsewhere the bar is solid and the
 * page starts below it.
 */
export const PHOTO_HERO_PATHS = [
  '/',
  '/about',
  '/services',
  '/process',
  '/projects',
  '/contact',
  '/calculator',
  '/blog',
  ...SERVICE_PAGES.map((page) => `/${page.slug}`),
];

export const hasPhotoHero = (path: string) =>
  PHOTO_HERO_PATHS.includes(path) || /^\/projects\/[^/]+$/.test(path);
