# Feature: Construction Cost Calculator (מחשבון אומדן עלות לבנייה פרטית)

**Branch:** `feature/construction-cost-calculator`
**Date:** 2025-02-22

## Overview

A client-side calculator that estimates total construction cost (range) for private building. After collecting user details and building preferences, it displays a price range and a WhatsApp button to schedule a meeting with Shiran.

---

## UI/UX Specification

- **Layout**: Single page, RTL. Form sections in a card layout. Desktop: 2-column grid where appropriate; mobile: stacked. Result section below form.
- **Components**: Reuse `Input`, `Button` from `client/src/components/ui`. Use `Card`-like section styling consistent with existing pages (e.g. `Process`, `Footer`).
- **Interactions**: Form validation via Zod + react-hook-form. Calculate button triggers client-side computation. Result shows price range + WhatsApp CTA. No section breakdown—only total range.
- **Accessibility**: WCAG 2.1 AA. Labels, `aria-invalid`, keyboard focus. Semantic `main`, `section`, `form`.

---

## User Inputs (Form Fields)

| Field | Type | Options / Constraints |
|-------|------|------------------------|
| שם מלא | text | Required, 2–50 chars |
| טלפון | tel | Required, 10 digits |
| אימייל | email | Required |
| שטח בנוי במ״ר | number | 160–500 |
| רמת גמר בנייה | select | סטנדרט / מושקע / יוקרתי |
| בריכה | select | ללא / קטנה / בינונית / גדולה |
| שטח פיתוח חוץ במ״ר | number | 0+ |
| רמת גמר פיתוח | select | סטנדרט / מושקע / יוקרתי |
| מטבח | select | סטנדרט / מושקע / יוקרתי |
| נגרות כללית | select | אין / קנייה מוכנה / ייצור לפי הזמנה |
| ריהוט | select | אין / בסיסי / מלא |
| אבזור והלבשה | select | אין / בסיסי / מלא |
| הצגת מחירים | radio | לפני מע״מ / כולל מע״מ |

---

## Calculation Logic

- **Client-side only** — no API. Pure function in `shared` or `client`.
- Each section contributes to total based on:
  - **House size** (sqm) × base rate per sqm
  - **Investment level** multiplier (סטנדרט ≈ 1, מושקע ≈ 1.3, יוקרתי ≈ 1.6)
- Output: single range `[min, max]` in ILS.
- If "כולל מע״מ" selected: multiply final range by `1.18`.
- No per-section breakdown shown to user.

### Base Rates (Example — adjust as needed)

- Construction: ~8,000–12,000 ₪/sqm (range by level)
- Outdoor development: ~500–1,500 ₪/sqm
- Pool: ללא 0, קטנה ~150k, בינונית ~250k, גדולה ~400k
- Kitchen, carpentry, furniture, equipment: fixed add-ons by level

---

## Result Display

- Show only: **₪ X,XXX,XXX – ₪ X,XXX,XXX**
- WhatsApp button: "לקביעת פגישת היכרות בוואטסאפ"
- WhatsApp link: `https://wa.me/97252174443?text=` + encoded message

### Pre-filled WhatsApp Message

```
היי שירן,
ביצעתי חישוב במחשבון אומדן עלות לבנייה פרטית
ואשמח לקבוע פגישת היכרות
```

---

## Data Flow

```
User fills form → Submit → validate (Zod) → calculateEstimate(inputs) → display range + WhatsApp CTA
```

---

## File Changes

### New Files

- **`shared/src/schemas/calculator.schema.ts`** (new)
  - Zod schema for calculator form (user details + building inputs)
  - Export `CalculatorFormInput`, `calculatorFormSchema`

- **`shared/src/utils/calculator.ts`** (new)
  - `calculateEstimate(input: CalculatorFormInput): { min: number; max: number }`
  - Pure function, no side effects

- **`client/src/pages/Calculator/Calculator.tsx`** (new)
  - Page component: form + result + WhatsApp button
  - Use `useForm` + `zodResolver(calculatorFormSchema)`
  - Reuse `Input`, `Button`; add select/radio components or native `<select>` with Tailwind

- **`client/src/pages/Calculator/index.ts`** (new)
  - Export default

### Edits

- **`client/src/App.tsx`**
  - Add lazy import for `Calculator`
  - Add route: `path: 'calculator'`, `title: 'מחשבון אומדן'`, `element: <Calculator />`

- **`client/src/components/Navbar/Navbar.tsx`** (if nav links are defined there)
  - Add link to `/calculator` if navbar has page links

---

## Constants

- WhatsApp number: `97252174443` (from `contact-info.ts`: 052-5174443)
- VAT multiplier: `1.18`

---

## Verification

- `npm run lint`
- `npm run type-check`
- `npm run test:run`
- Manual: Fill form, submit, verify range display and WhatsApp link opens with correct message

---

## Tasks for tasks.md

Copy the following into the Pending section of `tasks.md`:

```
- [Pending] Add construction cost calculator page with form and WhatsApp CTA — feature/construction-cost-calculator
```
