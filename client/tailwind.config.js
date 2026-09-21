/**
 * Every value here comes from src/styles/tokens.css. Colors, radii and shadows
 * replace Tailwind's defaults instead of extending them, so off-system classes
 * (`bg-gray-500`, `rounded-3xl`, `shadow-lg`) produce no style at all, and
 * `npm run lint:design` rejects hard-coded ones (`text-[#ccbebc]`).
 */
const role = (name) => `rgb(var(--color-${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      // Photo overlays and scrims only; surfaces and text use the roles below.
      white: 'rgb(var(--white) / <alpha-value>)',
      black: 'rgb(var(--black) / <alpha-value>)',
      primary: { DEFAULT: role('primary'), deep: role('primary-deep') },
      ink: {
        DEFAULT: role('ink'),
        muted: role('ink-muted'),
        subtle: role('ink-subtle'),
      },
      surface: {
        DEFAULT: role('surface'),
        raised: role('surface-raised'),
        soft: role('surface-soft'),
        sunken: role('surface-sunken'),
      },
      'on-dark': role('on-dark'),
      accent: {
        DEFAULT: role('accent'),
        strong: role('accent-strong'),
        soft: role('accent-soft'),
      },
      line: role('line'),
      danger: { DEFAULT: role('danger'), soft: role('danger-soft') },
      success: { DEFAULT: role('success'), soft: role('success-soft') },
      warning: { DEFAULT: role('warning'), soft: role('warning-soft') },
    },
    borderRadius: {
      none: '0',
      field: 'var(--radius-field)',
      card: 'var(--radius-card)',
      panel: 'var(--radius-panel)',
      full: '9999px',
    },
    boxShadow: {
      none: 'none',
      card: 'var(--shadow-card)',
      raised: 'var(--shadow-raised)',
      overlay: 'var(--shadow-overlay)',
    },
    fontFamily: {
      sans: 'var(--font-sans)',
    },
    extend: {
      fontSize: {
        display: ['var(--text-display)', { lineHeight: '1.04', letterSpacing: '-0.015em', fontWeight: '300' }],
        h1: ['var(--text-h1)', { lineHeight: '1.06', letterSpacing: '-0.01em', fontWeight: '300' }],
        h2: ['var(--text-h2)', { lineHeight: '1.15', fontWeight: '400' }],
        h3: ['var(--text-h3)', { lineHeight: '1.3', fontWeight: '600' }],
        lead: ['var(--text-lead)', { lineHeight: '1.6' }],
        body: ['var(--text-body)', { lineHeight: '1.75' }],
        small: ['var(--text-small)', { lineHeight: '1.6' }],
        eyebrow: ['var(--text-eyebrow)', { lineHeight: '1.2', fontWeight: '600' }],
      },
      spacing: {
        gutter: 'var(--gutter)',
        nav: 'var(--nav-height)',
        section: 'var(--space-section)',
        'section-tight': 'var(--space-section-tight)',
      },
      maxWidth: {
        container: 'var(--container)',
        measure: 'var(--measure)',
      },
      transitionTimingFunction: {
        // The built-in easings are too soft to read as intentional. `out` for
        // anything entering or responding to input, `in-out` for things moving
        // across the screen.
        out: 'var(--ease-out)',
        'in-out': 'var(--ease-in-out)',
      },
    },
  },
  plugins: [
    function ({ addVariant }) {
      addVariant('hover-capable', '@media (hover: hover)');
    },
  ],
};
