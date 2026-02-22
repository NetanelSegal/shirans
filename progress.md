# Progress

## History

### Construction Cost Calculator - 2025-02-22 [Complete]
Implemented calculator at `/admin/calculator` (admin only) with user details form, building inputs (built area 160–500 sqm, finish levels, pool, outdoor, kitchen, carpentry, furniture, equipment), price display (before/including VAT), and WhatsApp CTA. DB: CalculatorLead and CalculatorConfig models; API for leads CRUD and config; admin pages for leads list and config management. Code review: DOMPurify sanitization, HTTP_STATUS constants, P2025→404, formatPrice in shared, fieldset/legend, id/htmlFor accessibility. Branch: feature/construction-cost-calculator (merged).

### Email, Contacts, Users Admin - 2025-02-22
Implemented: (1) Email sender dual-submit + env vars, (2) Hide footer on Login/Register, (3) Admin users page, (4) Contacts display enhancements. Branch: feature/email-contacts-users-admin. See docs/feature-email-contacts-users-admin.md.

### Admin Dashboard Pages - 2025-02-22
Implemented full admin dashboard: Overview, Projects, Categories, Testimonials, Contacts management pages with CRUD. Branch: feature/admin-dashboard-pages.
