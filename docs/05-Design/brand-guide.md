# Brand Guide — Shiran Gilad Architecture & Interior Design

**Version:** 2.0 (September 2026 redesign)
**Source of truth:** [`client/src/styles/tokens.css`](../../client/src/styles/tokens.css). This document explains the system; the tokens *are* the system. Where the two disagree, the tokens win and this file is stale.

---

## How the system is enforced

Every colour, type size, radius, shadow and rhythm value lives in `tokens.css`, in two layers:

1. **Palette** — raw values, named for what they are (`--navy-800`). Only `tokens.css` uses them.
2. **Roles** — what a value is *for* (`--color-ink`, `--color-surface-sunken`). Components use roles only.

`client/tailwind.config.js` exposes the roles and **replaces** Tailwind's defaults rather than extending them, so an off-system class like `bg-gray-500` or `rounded-3xl` produces no style at all. `npm run lint:design` (part of `npm run lint`) rejects hard-coded values like `text-[#ccbebc]`.

A new colour starts in `tokens.css` or it doesn't exist.

---

## 1. Colour

**Navy on cream, and nothing else.** Six colours and a hairline.

| Palette | Hex | Used for |
|---|---|---|
| `navy-900` | `#13243b` | Dark bands, footer, photo scrims, the navbar once scrolled |
| `navy-800` | `#1a2d48` | Brand navy — headings, body text, buttons, icons, rules, links |
| `navy-600` | `#48566c` | Secondary and tertiary text |
| `cream-100` | `#f5f1eb` | Page background; cream type on dark bands |
| `cream-200` | `#ede6dd` | Sunken panels, alternating bands |
| `white` | `#ffffff` | Cards and form fields |
| `stone-300` | `#cfc8bf` | Hairlines only |

Status colours — `red`, `green`, `amber`, each with a `-50` tint — appear only in form messages and the admin. They are not part of the brand palette.

### Rules

- **There is no second blue.** A mid or pale "sky" blue beside the navy was tried twice and rejected twice by Shiran (Sep 2026). The accent *is* the navy. See [08-Feedback](../08-Feedback/2026-09-shiran-review.md).
- **There is no mustard, bronze or sand.** The original design's bronze accent was removed in the same review.
- **Several roles share a value on purpose.** `--color-accent`, `--color-accent-strong` and `--color-ink` all resolve to `navy-800`; `--color-surface-soft` resolves to `cream-100`. The role names stay so a component still says what it means, and giving one of them its own shade later is a one-line change.
- **Hierarchy comes from weight, not hue.** Because there is one blue, a secondary action is an *outlined* navy pill, told apart from the filled primary by weight.
- **Anything drawn in the accent must flip on dark bands.** Navy on navy is invisible. Tone-aware components (`SectionHeading`, `Eyebrow`, `FeatureStrip`, `ContactDetails`) take a `tone` prop for this.

---

## 2. Typography

**Family:** Assistant, loaded from `@fontsource/assistant`, with `system-ui` as the fallback.

The scale is fluid: each step is a `clamp()` from its phone size to its size at about 1440px.

| Token | Class | Phone → Desktop | Weight | Use |
|---|---|---|---|---|
| `--text-display` | `text-display` | 44 → 84px | 300 | Home hero only |
| `--text-h1` | `text-h1` | 40 → 72px | 300 | Page H1s |
| `--text-h2` | `text-h2` | 30 → 48px | 400 | Section headings |
| `--text-h3` | `text-h3` | 20 → 24px | 600 | Card titles, FAQ questions |
| `--text-lead` | `text-lead` | 18 → 22px | — | Intro paragraphs, hero subtitles |
| `--text-body` | `text-body` | 17px | — | Body copy |
| `--text-small` | `text-small` | 15px | — | Captions, metadata |
| `--text-eyebrow` | `text-eyebrow` | 12px | 600 | The small label above a heading |

### Rules

- **Large type is light, small type is heavy.** Display and H1 are weight 300; H3 and eyebrows are 600. This is what makes the headlines read as architectural rather than loud.
- **Size with the scale, never with raw Tailwind steps.** `text-lg`, `text-2xl` and `font-bold` used to be scattered through the calculator result page; they were the main reason it looked like a different site.
- **One H1 per page**, then a logical H2/H3 hierarchy (SEO requirement).
- **Only Latin labels are tracked out.** Letter-spacing Hebrew breaks the words apart; `Eyebrow` checks the script before applying `tracking`.
- **Line length:** `max-w-measure` (38rem) keeps Hebrew paragraphs comfortable.

---

## 3. Shape

### Photos are square

Anything that is a photo, or a panel a photo sits flush inside, has **no border radius and no frame**. This includes service cards, project tiles and rows, project galleries and the lightbox, article covers, and the calculator panels.

Cards of text, form fields and buttons keep their radius.

| Token | Value | Use |
|---|---|---|
| `--radius-field` | 6px | Inputs, checkboxes |
| `--radius-card` | 8px | Text cards (testimonials, the form card) |
| `--radius-panel` | 12px | Larger text panels |
| `rounded-full` | — | **Buttons** (pills) and icon discs |

### Hover zoom must be clipped

A photo that scales on hover must sit in a box with `overflow-hidden`. On the projects page the photo and the text panel overlap by design so a fade can blend them, and an unclipped zoom once slid an un-faded sliver of photo over the project title.

---

## 4. Components

All in `client/src/components/ui/`. Pages compose these; they don't restyle them.

### Buttons — `Button` / `ButtonLink`

One definition in `buttonStyles.ts`, shared by `<Button>` (does something) and `<ButtonLink>` (goes somewhere) so the two can't drift apart.

| Variant | Look | Where |
|---|---|---|
| `primary` | Filled navy pill | The main action on a light surface |
| `secondary` | **Outlined** navy pill, fills on hover | A second action on a light surface |
| `light` | Cream pill | The main action over a photo or a dark band |
| `outline` | Outlined cream pill | A second action over a photo or a dark band |
| `quiet` | Outlined, hairline border | Low-emphasis controls (filters, admin) |
| `text` | Underlined link with an arrow | "לכל הפרויקטים ←" |
| `danger` | Filled red | Admin only |

Sizes: `sm`, `md`, `lg`. **`lg` only reaches full size from `sm` up** — at 375px a full-size pill read as a banner.

**Never put a `<Button>` inside a `<Link>` or `<a>`.** It is invalid markup and announces as two controls. For a link that looks like a button, use `<ButtonLink>`, or apply `buttonStyles()` to the `<a>` directly.

### Layout

- **`Section`** — a full-width band. Owns vertical rhythm (`py-section`) and gutters; takes a `tone` (`surface`, `soft`, `sunken`, `raised`, `dark`). Every page is a stack of these.
- **`PageHero`** — the photo header every inner page opens with. The navbar floats transparent over it; a navy wash keeps cream type readable on any photo. Sizes: `page` and `tall`.
- **`SectionHeading`** and **`Eyebrow`** — headings with the site's hairline ornament. Both are tone-aware.
- **`FeatureStrip`** — a row of line icons split by hairlines (the band under the home hero, the calculator's three benefits).
- **`Faq`** — an accordion. Every answer is in the HTML whether or not its panel is open, so search engines read the whole list.

### Navbar

Fixed. Over a photo hero it starts transparent and turns navy on scroll.

**The blur lives on an inner bar, never on `<header>`.** `backdrop-filter` makes an element the containing block for its `position: fixed` descendants. With it on `<header>`, the mobile menu sheet resolved its `top`/`bottom` against the 4.5rem bar, came out zero pixels tall, and painted no background — the "transparent menu" bug fixed in September 2026.

---

## 5. Imagery

- **Site photography** is copied into `client/src/assets/site/` and referenced through [`constants/siteImages.ts`](../../client/src/constants/siteImages.ts), never linked from project media — deleting a project photo in Cloudinary must not silently break a page hero.
- **Sources:** Shiran's photo shoot and the `תמונות חדשות לאתר` set in Dropbox (`תוכן לאתר`).
- **Format:** WebP, in at least two widths; `<Photo>` picks one with `srcset`/`sizes`.
- **Crop to the box.** A 4:5 box filled from a 16:9 export upscales about 900px of detail across the column and looks blurry. Crop from the original frame instead (this is how the home page's "התהליך" photo was fixed).
- **Every meaningful image has its own ALT text** describing what is visible. No shared ALT, no keyword stuffing.
- **Project media** lives in Cloudinary under the admin's control.

### Hero video

Silent, looping, one for mobile and one for desktop — Cloudinary via `VITE_HERO_VIDEO_*_URL`, with local `.mov` files in `client/public/assets/` for development only.

---

## 6. Motion

- `EnterAnimation` — a fade and a short rise as a section enters.
- Two easings only, both in tokens: `ease-out` for things entering or responding, `ease-in-out` for things moving across the screen. The built-in easings are too soft to read as intentional.
- Everything respects `prefers-reduced-motion`.
