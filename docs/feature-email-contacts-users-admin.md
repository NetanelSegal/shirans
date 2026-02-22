# Feature: Email Sender, Contacts, Users Admin

**Branch:** `feature/email-contacts-users-admin`  
**Date:** 2025-02-22

## Overview

This feature implements four improvements:

1. **Email sender fix** – Dual-submit (EmailJS + backend API), env vars for secrets
2. **Footer visibility** – Hide footer on Login and Register pages
3. **Admin users** – Display users in admin dashboard
4. **Contacts display** – Total contacts stats, clickable email/phone in leads table

---

## Task 1: Email Sender Fix

### Changes

- **`client/src/components/Footer/hooks/useEmailSend.tsx`**  
  - Replaced hardcoded EmailJS IDs with env vars: `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`
  - Validates env vars before sending

- **`client/src/services/contact.service.ts`** (new)  
  - `submitContact(data)` – POSTs to `urls.contact.submit` with `CreateContactInput`

- **`client/src/components/Footer/components/FooterForm.tsx`**  
  - Dual-submit: `Promise.allSettled([sendEmail(data), submitContact({...})])`
  - Maps `context` → `message` for API
  - Success if at least one succeeds; error only if both fail
  - Calls `reset()` on success

- **`client/.env.example`**  
  - Added EmailJS env var placeholders

### Setup

Copy `.env.example` to `.env` (or `.env.development` / `.env.production`) and set:

```
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

---

## Task 2: Hide Footer on Auth Pages

### Changes

- **`client/src/components/Layout/Layout.tsx`**  
  - Uses `useLocation()` to hide `<Footer />` when pathname is `/login` or `/register`
  - `HIDE_FOOTER_PATHS` constant for maintainability

---

## Task 3: Admin Users

### Backend

- **`server/src/repositories/user.repository.ts`**  
  - `findAll()` – returns users without password (id, email, name, role, createdAt, updatedAt)

- **`server/src/services/user.service.ts`** (new)  
  - `getAllUsers()` – calls `userRepository.findAll()`

- **`server/src/controllers/user.controller.ts`** (new)  
  - `getAllUsers` – GET handler, returns users array

- **`server/src/routes/user.routes.ts`** (new)  
  - `GET /` – protected by `authenticate`, `requireAdmin`

- **`server/src/app.ts`**  
  - Mounted at `/api/users`

- **`server/src/docs/swagger/paths/users.paths.ts`** (new)  
  - Swagger docs for `GET /api/users`

### Client

- **`client/src/constants/urls.ts`**  
  - `adminUsers.getAll`

- **`client/src/services/admin/users.service.ts`** (new)  
  - `fetchAllUsers()`

- **`client/src/hooks/admin/useAdminUsers.ts`** (new)  
  - State, fetch, refresh (same pattern as `useAdminContacts`)

- **`client/src/pages/Admin/UsersManagement.tsx`** (new)  
  - DataTable: name, email, role (מנהל/משתמש), createdAt

- **`client/src/App.tsx`**  
  - Route `path: 'users'` under admin

- **`client/src/components/Admin/AdminLayout.tsx`**  
  - Nav link to `/admin/users` – "משתמשים"

- **`client/src/pages/Admin/Overview.tsx`**  
  - StatsCard for users count

---

## Task 4: Contacts Display Enhancements

### Changes

- **`client/src/pages/Admin/Overview.tsx`**  
  - Added "סה״כ פניות" (total contacts) StatsCard
  - Kept "פניות שלא נקראו" (unread) StatsCard
  - Different icons: `fa-envelope` (total), `fa-envelope-open` (unread)

- **`client/src/pages/Admin/ContactsManagement.tsx`**  
  - Email column: `<a href="mailto:...">` with `aria-label`
  - Phone column: `<a href="tel:...">` with `aria-label`

---

## Data Flow: Contact Form

```
User submits footer form
    → Promise.allSettled([
        sendEmail(data) → EmailJS (email notification),
        submitContact({...}) → POST /api/contact → DB
      ])
    → Success if ≥1 succeeds; error only if both fail
    → reset() on success
```

---

## Error Keys

- `SERVER.USER.FETCH_USERS_FAILED` – added to shared, server, and client error messages
