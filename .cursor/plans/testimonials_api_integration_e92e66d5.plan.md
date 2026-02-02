---
name: Testimonials API Integration
overview: Create backend API for testimonials and integrate with frontend. Currently, testimonials are hardcoded in the frontend component. This task will create API endpoints to fetch testimonials from the database and update the frontend to use the API.
todos:
  - id: testimonial-backend-repo
    content: Create testimonial.repository.ts with CRUD operations
    status: pending
  - id: testimonial-backend-service
    content: Create testimonial.service.ts with business logic and filtering
    status: pending
  - id: testimonial-backend-controller
    content: Create testimonial.controller.ts with route handlers
    status: pending
  - id: testimonial-backend-validator
    content: Create testimonial.validators.ts with validation schemas
    status: pending
  - id: testimonial-backend-routes
    content: Create testimonial.routes.ts and integrate into app.ts
    status: pending
  - id: testimonial-backend-types
    content: Create testimonial.types.ts with TypeScript interfaces
    status: pending
  - id: testimonial-frontend-context
    content: Create TestimonialsContext or useTestimonials hook
    status: pending
  - id: testimonial-frontend-update
    content: Update Testimonials component to use API data
    status: pending
  - id: testimonial-migration
    content: Migrate hardcoded testimonials to database
    status: pending
isProject: false
---

# Testimonials API Integration

## Overview

Create backend API endpoints for testimonials and integrate with the frontend. Currently, testimonials are hardcoded in `client/src/pages/Home/components/Testimonials.tsx`. The Prisma schema already has a `Testimonial` model with fields: `id`, `name`, `message`, `isPublished`, `order`, `createdAt`, `updatedAt`.

## Files to Create/Modify

### Backend

- `server/src/routes/testimonial.routes.ts` - New route file
- `server/src/controllers/testimonial.controller.ts` - Controller for testimonial operations
- `server/src/services/testimonial.service.ts` - Business logic
- `server/src/repositories/testimonial.repository.ts` - Data access layer
- `server/src/types/testimonial.types.ts` - TypeScript types
- `server/src/validators/testimonial.validators.ts` - Validation schemas
- `server/src/app.ts` - Add testimonial routes
- `server/test/integration/testimonial.routes.test.ts` - Integration tests

### Frontend

- `client/src/contexts/TestimonialsContext.tsx` - Context for testimonials (similar to ProjectsContext)
- `client/src/hooks/useTestimonials.ts` - Hook to fetch testimonials
- `client/src/pages/Home/components/Testimonials.tsx` - Update to use API data
- `client/src/constants/urls.ts` - Add testimonials API endpoint

## Implementation Steps

### Backend Implementation

1. **Repository Layer** (`testimonial.repository.ts`)

- `findAll()` - Get all published testimonials, ordered by `order` field
- `findAllAdmin()` - Get all testimonials (including unpublished) for admin
- `findById()` - Get single testimonial
- `create()` - Create new testimonial
- `update()` - Update testimonial
- `delete()` - Delete testimonial

1. **Service Layer** (`testimonial.service.ts`)

- `getPublishedTestimonials()` - Get only published testimonials, sorted by order
- `getAllTestimonials()` - Get all (admin use)
- `createTestimonial()` - Create with validation
- `updateTestimonial()` - Update testimonial
- `deleteTestimonial()` - Delete testimonial
- Transform Prisma models to response format

1. **Controller Layer** (`testimonial.controller.ts`)

- `GET /api/testimonials` - Get published testimonials (public)
- `GET /api/testimonials/all` - Get all testimonials (admin - future auth)
- `GET /api/testimonials/:id` - Get single testimonial (admin)
- `POST /api/testimonials` - Create testimonial (admin)
- `PUT /api/testimonials/:id` - Update testimonial (admin)
- `DELETE /api/testimonials/:id` - Delete testimonial (admin)

1. **Validation** (`testimonial.validators.ts`)

- Validate name (required, 2-100 chars)
- Validate message (required, 10-2000 chars)
- Validate isPublished (boolean)
- Validate order (number, >= 0)

1. **Routes** (`testimonial.routes.ts`)

- Mount at `/api/testimonials`
- Apply validation middleware

1. **Integration**

- Add routes to `server/src/app.ts`
- Follow existing patterns from project routes

### Frontend Implementation

1. **Context/Hook** (`TestimonialsContext.tsx` or `useTestimonials.ts`)

- Fetch testimonials on mount
- Cache testimonials data
- Provide loading/error states
- Similar pattern to `ProjectsContext`

1. **Update Testimonials Component** (`Testimonials.tsx`)

- Remove hardcoded testimonials array
- Use context/hook to fetch from API
- Handle loading state (show skeleton/spinner)
- Handle error state (fallback or error message)
- Keep existing animation logic

1. **Data Migration**

- Create script or manual process to migrate existing hardcoded testimonials to database
- Set `isPublished: true` and appropriate `order` values

## Key Considerations

- Only fetch published testimonials for public endpoint
- Maintain existing carousel animation behavior
- Handle empty state (no testimonials)
- Order testimonials by `order` field (ascending)
- Follow existing code patterns (repository-service-controller)
- Add proper error handling
- TypeScript types throughout

## Testing

- Integration tests for API endpoints
- Test published vs unpublished filtering
- Test ordering
- Test CRUD operations (admin endpoints)

## Migration Strategy

- Option 1: Create migration script to insert hardcoded testimonials into database
- Option 2: Manually insert testimonials via Prisma Studio
- Option 3: Keep hardcoded as fallback until database is populated

## Notes

- Admin endpoints can be protected later when authentication is implemented
- Consider adding image/avatar field to testimonials in future
- Order field allows manual ordering of testimonials display
