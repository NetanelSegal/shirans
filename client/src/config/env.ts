/**
 * Centralized environment configuration for the frontend.
 * All VITE_* env vars should be accessed through this file.
 *
 * Add new vars here and to client/.env.example
 */
const env = import.meta.env;

function resolveEnvUrl(value: string | undefined, fallback: string): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

/** Prefer browser-friendly Cloudinary delivery for hero background videos. */
export function normalizeHeroVideoUrl(url: string): string {
  if (!url.includes('res.cloudinary.com') || !url.includes('/video/upload/')) {
    return url;
  }
  if (url.includes('/video/upload/f_auto') || url.includes('/video/upload/q_auto')) {
    return url;
  }
  return url.replace('/video/upload/', '/video/upload/f_auto,q_auto/');
}

export const envConfig = {
  /** API base URL (e.g. http://localhost:3000) */
  apiUrl: env.VITE_API_URL ?? '',

  /** Use static file data instead of API (dev) */
  useFileData: env.VITE_USE_FILE_DATA === 'true',

  /** Skip animations (accessibility/testing) */
  skipAnimations: env.VITE_SKIP_ANIMATIONS === 'true',

  /** EmailJS - Contact form */
  emailjs: {
    serviceId: env.VITE_EMAILJS_SERVICE_ID ?? '',
    templateId: env.VITE_EMAILJS_TEMPLATE_ID ?? '',
    calculatorTemplateId: env.VITE_EMAILJS_CALCULATOR_TEMPLATE_ID ?? '',
    publicKey: env.VITE_EMAILJS_PUBLIC_KEY ?? '',
  },

  /**
   * Home hero background videos (Cloudinary delivery URLs in production).
   * Falls back to local public assets when unset (local dev only).
   */
  heroVideos: {
    desktop: normalizeHeroVideoUrl(
      resolveEnvUrl(
        env.VITE_HERO_VIDEO_DESKTOP_URL,
        '/assets/hero-vid-desktop.mov',
      ),
    ),
    mobile: normalizeHeroVideoUrl(
      resolveEnvUrl(
        env.VITE_HERO_VIDEO_MOBILE_URL,
        '/assets/hero-vid-mobile.mov',
      ),
    ),
  },
} as const;

/** Whether EmailJS is configured for contact form */
export const isEmailJsContactConfigured = (): boolean =>
  !!(
    envConfig.emailjs.serviceId &&
    envConfig.emailjs.templateId &&
    envConfig.emailjs.publicKey
  );

/** Whether EmailJS is configured for calculator lead notification */
export const isEmailJsCalculatorConfigured = (): boolean =>
  !!(
    envConfig.emailjs.serviceId &&
    envConfig.emailjs.calculatorTemplateId &&
    envConfig.emailjs.publicKey
  );
