# 03 PRDs - Product Requirements

## Core Features: Shiran Gilad Portfolio

### 1. Portfolio & Showcase (Homepage)
- **High-End Hero:** Clean architectural visuals, hero video backgrounds.
- **Projects Grid:** Filterable list of projects by category (the categories are managed in the admin).
- **Process Showcase:** Clear step-by-step architectural design journey.
- **Social Proof:** Testimonials from satisfied homeowners and professional partners.

### 2. Services
- **Services overview** (`/services`) listing the five services.
- **A page per service**, each at its own URL: private-house architecture, interior design, architectural consulting, online consulting, and architecture with licensing and permits. Each page has who it's for, what's included, how it works, an FAQ, and the contact band. Built from Shiran's page designs; see [08-Feedback](../08-Feedback/2026-09-shiran-review.md).
- "דירות יוקרה" and "עיצוב מסחרי" are **no longer offered** (removed at Shiran's request, Sep 2026).

### 3. Knowledge Centre (blog)
- **Index** (`/blog`) with a lead article, a grid, and a category filter.
- **Article page** (`/blog/:slug`) — its own URL, title, category, date, reading time, cover, body, FAQ, and three more articles.
- **Admin authoring** — Shiran writes and publishes without a developer: rich-text body with images, cover and ALT text, category, FAQ, draft/published, per-article SEO title and description, bulk publish/unpublish/delete.
- **SEO** — static share page per article, sitemap entry, Article/BreadcrumbList/FAQPage structured data.

### 4. Lead Generation & Contact
- **Contact Form:** Integrated lead capture for name, email, phone, and message.
- **Cost Calculator:** Interactive tool for homeowners to estimate renovation or architectural planning costs.
- **Project Detail Page:** Deep dive into individual projects with high-quality images and architectural plans.

### 5. Admin Dashboard
- **Projects CRUD:** Add, edit, and delete projects, including main images and multi-image galleries.
- **Categories CRUD:** Manage project categories.
- **Testimonials CRUD:** Approve and publish testimonials.
- **Articles CRUD:** Write, publish and manage knowledge-centre articles.
- **Lead Tracking:** Review contact submissions and calculator-generated leads.
- **User Management:** Manage administrative users and roles.

### 6. User Experience (UX)
- **RTL-First:** Full support for Hebrew (RTL) across all pages.
- **Responsive Design:** Seamless experience on mobile devices, especially for project viewing.
- **Premium Performance:** Fast load times through lazy loading and image optimization.

### 7. SEO
The per-page URLs, titles, descriptions and H1s, and the implementation requirements, are in the [SEO brief](seo-brief.md).
