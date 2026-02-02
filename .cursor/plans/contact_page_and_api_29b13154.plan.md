---
name: Contact Page and API
overview: Implement a complete contact page with backend API integration. Currently, the contact route is empty and the footer form uses EmailJS. This task will create a dedicated contact page and integrate it with the backend ContactSubmission model.
todos:
  - id: contact-backend-repo
    content: Create contact.repository.ts with CRUD operations
    status: pending
  - id: contact-backend-service
    content: Create contact.service.ts with business logic
    status: pending
  - id: contact-backend-controller
    content: Create contact.controller.ts with route handlers
    status: pending
  - id: contact-backend-validator
    content: Create contact.validators.ts with validation schemas
    status: pending
  - id: contact-backend-routes
    content: Create contact.routes.ts and integrate into app.ts
    status: pending
  - id: contact-backend-types
    content: Create contact.types.ts with TypeScript interfaces
    status: pending
  - id: contact-frontend-page
    content: Create Contact page component
    status: pending
  - id: contact-frontend-form
    content: Create reusable ContactForm component
    status: pending
  - id: contact-frontend-hook
    content: Create useContactSubmission hook for API calls
    status: pending
  - id: contact-frontend-integration
    content: Update App.tsx to use Contact page and integrate form
    status: pending
isProject: false
---

# Contact Page and Backend API Implementation

## Overview

Create a dedicated contact page (`/contact`) and implement backend API endpoints for contact form submissions. Currently, the contact route shows an empty div, and the footer form uses EmailJS. This will integrate with the existing `ContactSubmission` Prisma model.

## Files to Create/Modify

### Backend

- `server/src/routes/contact.routes.ts` - New route file for contact endpoints
- `server/src/controllers/contact.controller.ts` - Controller for contact operations
- `server/src/services/contact.service.ts` - Business logic for contact submissions
- `server/src/repositories/contact.repository.ts` - Data access layer for ContactSubmission
- `server/src/types/contact.types.ts` - TypeScript types for contact operations
- `server/src/validators/contact.validators.ts` - Validation schemas for contact form
- `server/src/app.ts` - Add contact routes to Express app
- `server/test/integration/contact.routes.test.ts` - Integration tests

### Frontend

- `client/src/pages/Contact/Contact.tsx` - New contact page component
- `client/src/pages/Contact/index.tsx` - Export file
- `client/src/components/ContactForm/ContactForm.tsx` - Reusable contact form component (can refactor FooterForm to use this)
- `client/src/hooks/useContactSubmission.ts` - Hook for submitting contact forms
- `client/src/constants/urls.ts` - Add API endpoint constant
- `client/src/App.tsx` - Update contact route to use new Contact component

## Implementation Steps

### Backend Implementation

1. **Repository Layer** (`contact.repository.ts`)

- `create()` - Create new contact submission
- `findAll()` - Get all submissions (with pagination)
- `findById()` - Get single submission
- `markAsRead()` - Update isRead status
- `delete()` - Delete submission

1. **Service Layer** (`contact.service.ts`)

- `submitContact()` - Validate and create submission
- `getSubmissions()` - Get submissions with filters (isRead, date range)
- `getSubmissionById()` - Get single submission
- `updateReadStatus()` - Mark as read/unread
- Transform Prisma models to response format

1. **Controller Layer** (`contact.controller.ts`)

- `POST /api/contact` - Submit contact form (public)
- `GET /api/contact` - Get all submissions (admin only - future auth)
- `GET /api/contact/:id` - Get single submission (admin)
- `PATCH /api/contact/:id/read` - Mark as read/unread (admin)
- `DELETE /api/contact/:id` - Delete submission (admin)

1. **Validation** (`contact.validators.ts`)

- Validate name (2-50 chars, required)
- Validate email (valid email format, required)
- Validate phoneNumber (10 digits, required)
- Validate message (optional, max 2000 chars)

1. **Routes** (`contact.routes.ts`)

- Mount contact routes at `/api/contact`
- Apply validation middleware

1. **Integration**

- Add routes to `server/src/app.ts`
- Follow existing patterns from `project.routes.ts`

### Frontend Implementation

1. **Contact Page** (`Contact.tsx`)

- Create dedicated contact page with form
- Display contact information (from `client/src/data/contact-info.ts`)
- Include map/location if available
- Add metadata with Helmet

1. **Contact Form Component** (`ContactForm.tsx`)

- Extract reusable form logic
- Support both footer and contact page usage
- Form validation (client-side)
- Loading states and error handling
- Success message display

1. **API Integration** (`useContactSubmission.ts`)

- Hook to submit contact form to backend
- Handle loading, error, and success states
- Replace EmailJS integration (or keep as fallback)

1. **Update Footer Form**

- Optionally refactor to use new ContactForm component
- Or keep EmailJS as backup, add backend submission

## Key Considerations

- Follow existing patterns from project routes/controllers/services
- Use same error handling middleware
- Validate input on both client and server
- Store submissions in database for admin review
- Keep EmailJS as optional fallback or remove after backend is tested
- Add proper TypeScript types throughout
- Follow Single Source of Truth for API URLs

## Testing

- Integration tests for all API endpoints
- Test validation errors
- Test success cases
- Test error handling

## Notes

- Contact form in footer can continue using EmailJS initially, or be migrated to use backend API
- Admin endpoints can be protected later when authentication is implemented
