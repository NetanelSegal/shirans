/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_USE_FILE_DATA: string;
  readonly VITE_SKIP_ANIMATIONS?: string;
  readonly VITE_EMAILJS_SERVICE_ID?: string;
  readonly VITE_EMAILJS_TEMPLATE_ID?: string;
  readonly VITE_EMAILJS_CALCULATOR_TEMPLATE_ID?: string;
  readonly VITE_EMAILJS_PUBLIC_KEY?: string;
  readonly VITE_GTM_ID?: string;
  readonly VITE_GA4_MEASUREMENT_ID?: string;
  readonly VITE_GOOGLE_ADS_ID?: string;
  readonly VITE_GOOGLE_ADS_LEAD_LABEL?: string;
  /** Netlify build context, injected in vite.config.ts. */
  readonly VITE_DEPLOY_CONTEXT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
