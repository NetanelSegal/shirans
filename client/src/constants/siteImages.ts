/**
 * The site's own photography: page heroes, section images, service cards.
 *
 * These are copies, not links to project media. Project images live in
 * Cloudinary under the admin's control, and deleting one there would silently
 * break a page hero. Each image comes in the widths listed; <Photo> picks one.
 *
 * Sources: Shiran's photo shoot and the "תמונות חדשות לאתר" set she supplies
 * in Dropbox ("תוכן לאתר"), plus project photos.
 */
import shiranPortrait700 from '@/assets/site/shiran-portrait-700.webp';
import shiranPortrait1200 from '@/assets/site/shiran-portrait-1200.webp';
import shiranKitchen900 from '@/assets/site/shiran-kitchen-900.webp';
import shiranKitchen1600 from '@/assets/site/shiran-kitchen-1600.webp';
import processHero1000 from '@/assets/site/process-hero-1000.webp';
import processHero2000 from '@/assets/site/process-hero-2000.webp';
import projectsHero1000 from '@/assets/site/projects-hero-1000.webp';
import projectsHero2000 from '@/assets/site/projects-hero-2000.webp';
import contactHero700 from '@/assets/site/contact-hero-700.webp';
import contactHero1400 from '@/assets/site/contact-hero-1400.webp';
import servicesHero1000 from '@/assets/site/services-hero-1000.webp';
import servicesHero2000 from '@/assets/site/services-hero-2000.webp';
import servicePrivate700 from '@/assets/site/service-private-700.webp';
import servicePrivate1400 from '@/assets/site/service-private-1400.webp';
import serviceResidential700 from '@/assets/site/service-residential-700.webp';
import serviceResidential1400 from '@/assets/site/service-residential-1400.webp';
import serviceLicensing700 from '@/assets/site/service-licensing-700.webp';
import serviceLicensing1400 from '@/assets/site/service-licensing-1400.webp';
import serviceConsulting700 from '@/assets/site/service-consulting-700.webp';
import serviceConsulting1400 from '@/assets/site/service-consulting-1400.webp';
import processStep1700 from '@/assets/site/process-step-1-700.webp';
import processStep11400 from '@/assets/site/process-step-1-1400.webp';
import processStep2700 from '@/assets/site/process-step-2-700.webp';
import processStep21400 from '@/assets/site/process-step-2-1400.webp';
import processStep3700 from '@/assets/site/process-step-3-700.webp';
import processStep31400 from '@/assets/site/process-step-3-1400.webp';
import processStep4700 from '@/assets/site/process-step-4-700.webp';
import processStep41400 from '@/assets/site/process-step-4-1400.webp';
import processStep5700 from '@/assets/site/process-step-5-700.webp';
import processStep51400 from '@/assets/site/process-step-5-1400.webp';
import kitchenIsland800 from '@/assets/site/kitchen-island-800.webp';
import kitchenIsland1500 from '@/assets/site/kitchen-island-1500.webp';
import masterBath800 from '@/assets/site/master-bath-800.webp';
import masterBath1500 from '@/assets/site/master-bath-1500.webp';
import livingRoom800 from '@/assets/site/living-room-800.webp';
import livingRoom1500 from '@/assets/site/living-room-1500.webp';
import houseDay800 from '@/assets/site/house-day-800.webp';
import houseDay1500 from '@/assets/site/house-day-1500.webp';
import houseEvening800 from '@/assets/site/house-evening-800.webp';
import houseEvening1500 from '@/assets/site/house-evening-1500.webp';
import bedroom800 from '@/assets/site/bedroom-800.webp';
import bedroom1500 from '@/assets/site/bedroom-1500.webp';

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
    [900, shiranKitchen900],
    [1600, shiranKitchen1600],
  ),
  processHero: image('מרפסת מקורה עם פינת ישיבה וצמחייה', [1000, processHero1000], [2000, processHero2000]),
  projectsHero: image('וילה מחופה אבן עם בריכה בכרתים בשעת דמדומים', [1000, projectsHero1000], [2000, projectsHero2000]),
  contactHero: image('בית פרטי עם בריכה וגינה בשעת ערב', [700, contactHero700], [1400, contactHero1400]),
  servicesHero: image('מטבח עם אי מעץ ותאורה תלויה', [1000, servicesHero1000], [2000, servicesHero2000]),

  /* Services — one photo per service Shiran offers. */
  servicePrivate: image('בית פרטי מחופה אבן עם גינה', [700, servicePrivate700], [1400, servicePrivate1400]),
  serviceResidential: image('סלון מעוצב בגוונים בהירים', [700, serviceResidential700], [1400, serviceResidential1400]),
  serviceLicensing: image('תוכניות בנייה על שולחן עבודה', [700, serviceLicensing700], [1400, serviceLicensing1400]),
  serviceConsulting: image('פגישת ייעוץ אדריכלי', [700, serviceConsulting700], [1400, serviceConsulting1400]),

  /* The five process steps, in order. */
  processStep1: image('שיחת תיאום ציפיות', [700, processStep1700], [1400, processStep11400]),
  processStep2: image('הפקת תיק מידע להיתר', [700, processStep2700], [1400, processStep21400]),
  processStep3: image('תכנון המבנה', [700, processStep3700], [1400, processStep31400]),
  processStep4: image('הגשת התוכניות לוועדה', [700, processStep4700], [1400, processStep41400]),
  processStep5: image('שלב הבנייה באתר', [700, processStep5700], [1400, processStep51400]),

  /* Shiran's renders (28.11.2026). Article covers must not repeat: one image, one article. */
  kitchenIsland: image('מטבח בגווני בז׳ עם אי משיש ופינת ישיבה', [800, kitchenIsland800], [1500, kitchenIsland1500]),
  masterBath: image('חדר רחצה הורים עם אמבטיה חופשית וחלון לגינה', [800, masterBath800], [1500, masterBath1500]),
  livingRoom: image('סלון פתוח לגינה עם מדרגות מרחפות', [800, livingRoom800], [1500, livingRoom1500]),
  houseDay: image('בית פרטי מודרני עם חזית אבן, עץ וחלונות גדולים', [800, houseDay800], [1500, houseDay1500]),
  houseEvening: image('בית פרטי מואר בערב עם שביל כניסה וגינה', [800, houseEvening800], [1500, houseEvening1500]),
  bedroom: image('חדר שינה הורים בגוונים חמים עם חלון לגינה', [800, bedroom800], [1500, bedroom1500]),
} as const;

export type SiteImageName = keyof typeof SITE_IMAGES;
