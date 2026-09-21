/**
 * The site's own photography: page heroes, section images, service cards.
 *
 * These are copies, not links to project media. Project images live in
 * Cloudinary under the admin's control, and deleting one there would silently
 * break a page hero. Each image comes in the widths listed; <Photo> picks one.
 *
 * Sources: Shiran's photo shoot (Dropbox "תוכן לאתר") and project photos.
 */
import shiranPortrait700 from '@/assets/site/shiran-portrait-700.webp';
import shiranPortrait1200 from '@/assets/site/shiran-portrait-1200.webp';
import shiranKitchen1000 from '@/assets/site/shiran-kitchen-1000.webp';
import shiranKitchen2000 from '@/assets/site/shiran-kitchen-2000.webp';
import processHero1000 from '@/assets/site/process-hero-1000.webp';
import processHero2000 from '@/assets/site/process-hero-2000.webp';
import projectsHero1000 from '@/assets/site/projects-hero-1000.webp';
import projectsHero2000 from '@/assets/site/projects-hero-2000.webp';
import contactHero1000 from '@/assets/site/contact-hero-1000.webp';
import contactHero2000 from '@/assets/site/contact-hero-2000.webp';
import servicesHero1000 from '@/assets/site/services-hero-1000.webp';
import servicesHero2000 from '@/assets/site/services-hero-2000.webp';
import ctaHouse900 from '@/assets/site/cta-house-900.webp';
import ctaHouse1600 from '@/assets/site/cta-house-1600.webp';
import servicePrivate from '@/assets/site/service-private-700.webp';
import serviceCommercial from '@/assets/site/service-commercial-700.webp';
import serviceLicensing from '@/assets/site/service-licensing-700.webp';
import serviceResidential from '@/assets/site/service-residential-700.webp';
import serviceLuxury from '@/assets/site/service-luxury-700.webp';
import serviceConsulting from '@/assets/site/service-consulting-700.webp';

export interface SiteImage {
  /** Width → URL, smallest first. */
  sources: ReadonlyArray<readonly [number, string]>;
  alt: string;
}

const image = (alt: string, ...sources: Array<readonly [number, string]>): SiteImage => ({
  alt,
  sources,
});

export const SITE_IMAGES = {
  shiranPortrait: image(
    'שירן גלעד במטבח שתכננה',
    [700, shiranPortrait700],
    [1200, shiranPortrait1200],
  ),
  shiranKitchen: image(
    'שירן גלעד במטבח מעוצב עם אי מעץ',
    [1000, shiranKitchen1000],
    [2000, shiranKitchen2000],
  ),
  processHero: image('מרפסת מקורה עם פינת ישיבה וצמחייה', [1000, processHero1000], [2000, processHero2000]),
  projectsHero: image('סלון בהיר עם וילונות ותאורה נסתרת', [1000, projectsHero1000], [2000, projectsHero2000]),
  contactHero: image('חלל מגורים פתוח ומואר', [1000, contactHero1000], [2000, contactHero2000]),
  servicesHero: image('מטבח עם אי מעץ ותאורה תלויה', [1000, servicesHero1000], [2000, servicesHero2000]),
  ctaHouse: image('בית עץ עם גינה', [900, ctaHouse900], [1600, ctaHouse1600]),
  servicePrivate: image('בית פרטי מחופה אבן', [700, servicePrivate]),
  serviceCommercial: image('מטבח מעוצב', [700, serviceCommercial]),
  serviceLicensing: image('מטבח בהיר בבית משפחתי', [700, serviceLicensing]),
  serviceResidential: image('סלון מעוצב', [700, serviceResidential]),
  serviceLuxury: image('חדר שינה מעוצב', [700, serviceLuxury]),
  serviceConsulting: image('מטבח ופינת אוכל', [700, serviceConsulting]),
} as const;

export type SiteImageName = keyof typeof SITE_IMAGES;
