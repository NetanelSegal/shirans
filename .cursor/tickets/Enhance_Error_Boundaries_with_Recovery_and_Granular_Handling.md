# Enhance Error Boundaries with Recovery and Granular Handling

## Overview

Enhance the existing error boundary implementation to provide robust error handling with reset functionality, granular boundaries at multiple levels, error reporting, and improved fallback UIs.

**Related Spec:** `spec:579384fa-c272-4cf0-a25d-99217963dda6/a2dd3ea6-7732-4a8b-80dc-c4cb5fd8c05f`

## Tasks

### 1. Enhance Base ErrorBoundary Component

**Files to modify:**
- `file:client/src/components/ErrorBoundary/ErrorBoundary.tsx`

**Implementation:**
- Add new props:
  - `onReset?: () => void` - callback when error is reset
  - `resetKeys?: unknown[]` - auto-reset when keys change
  - `FallbackComponent?: ComponentType` - custom fallback UI
  - `name?: string` - boundary identifier for debugging
  - `inline?: boolean` - inline vs full-section fallback
- Add `reset()` method to clear error state
- Implement `componentDidUpdate` to auto-reset on `resetKeys` change
- Add error reporting in `componentDidCatch` (call error reporting service)
- Improve fallback UI with reset button

### 2. Create Error Fallback Components

**Files to create:**
- `file:client/src/components/ErrorBoundary/ErrorFallback.tsx`
- `file:client/src/components/ErrorBoundary/ErrorDetails.tsx`

**ErrorFallback.tsx:**
- Create reusable fallback component
- Support variants: `full-page`, `section`, `inline`
- Include reset button
- Include navigation options (for full-page)
- RTL support with Hebrew messages
- Accessibility: proper ARIA labels, keyboard navigation

**ErrorDetails.tsx:**
- Display error message
- Display component stack (dev mode only)
- Display boundary name
- Copy error info button
- Only render in development mode

### 3. Create Specialized Error Boundary Variants

**Files to create:**
- `file:client/src/components/ErrorBoundary/RootErrorBoundary.tsx`
- `file:client/src/components/ErrorBoundary/RouteErrorBoundary.tsx`

**RootErrorBoundary:**
- Extends base ErrorBoundary
- Uses full-page fallback
- Reports all errors to tracking service
- Provides navigation to home

**RouteErrorBoundary:**
- Extends base ErrorBoundary
- Uses section fallback
- Allows navigation to other routes
- Auto-resets on route change (using location as resetKey)

### 4. Create useErrorBoundary Hook

**Files to create:**
- `file:client/src/hooks/useErrorBoundary.ts`

**Implementation:**
- Hook for manually triggering error boundaries
- Methods:
  - `showBoundary(error: Error)` - throw error to boundary
  - `resetBoundary()` - reset error state
- Use state to store and throw errors

### 5. Create Error Reporting Service

**Files to create:**
- `file:client/src/utils/errorReporting.ts`

**Implementation:**
- Create error reporting interface
- Mock implementation for development (console.error)
- Production-ready structure for Sentry/LogRocket integration
- Include context metadata:
  - User info (if authenticated)
  - Current route
  - Component stack
  - Browser info
  - Timestamp
- Rate limiting to prevent spam

### 6. Integrate Root Error Boundary in App

**Files to modify:**
- `file:client/src/App.tsx`

**Actions:**
- Import RootErrorBoundary
- Wrap entire app (outermost wrapper)
- Configure with error reporting

### 7. Add Route Error Boundaries

**Files to modify:**
- `file:client/src/components/Layout/Layout.tsx` (or individual route files)

**Actions:**
- Wrap each route with RouteErrorBoundary
- Pass route name for debugging
- Use location as resetKey for auto-reset on navigation

### 8. Add Component Error Boundaries to Critical Sections

**Files to modify:**
- `file:client/src/pages/Home/sections/TestimonialsSection/TestimonialsSection.tsx`
- `file:client/src/components/FavoriteProjects/FavoriteProjects.tsx`
- `file:client/src/pages/Projects/Projects.tsx`

**Actions:**
- Wrap critical/expensive components with ErrorBoundary
- Use inline variant for minimal disruption
- Provide component-specific fallback messages

### 9. Update Error Handler Integration

**Files to modify:**
- `file:client/src/utils/errorHandler.ts`

**Actions:**
- Import error reporting service
- Call error reporting in `logError()` function
- Ensure no duplicate reporting (boundary + handler)

### 10. Test Error Boundary System

**Testing checklist:**
- ✅ Root boundary catches app-level errors
- ✅ Route boundaries isolate page errors
- ✅ Component boundaries isolate section errors
- ✅ Reset button works and clears error state
- ✅ Auto-reset on route change works
- ✅ Error details display in dev mode only
- ✅ Error reporting called with correct context
- ✅ Fallback UIs are accessible
- ✅ Navigation from error states works
- ✅ Multiple boundaries don't interfere with each other

## Acceptance Criteria

- [ ] Base ErrorBoundary enhanced with reset functionality
- [ ] ErrorFallback component created with 3 variants (full-page, section, inline)
- [ ] ErrorDetails component created (dev mode only)
- [ ] RootErrorBoundary and RouteErrorBoundary created
- [ ] useErrorBoundary hook created
- [ ] Error reporting service created and integrated
- [ ] RootErrorBoundary wrapping entire app
- [ ] RouteErrorBoundary on all major routes (Home, Projects, Process, About)
- [ ] Component boundaries on at least 3 critical components
- [ ] All error boundaries tested with manual error triggers
- [ ] Accessibility verified (keyboard navigation, screen readers)
- [ ] Error reporting working in dev mode (console logs)
- [ ] No full app crashes from component errors

## Technical Notes

**Error Boundary Hierarchy:**
```
RootErrorBoundary (App.tsx)
  └─ RouteErrorBoundary (Home)
      └─ ErrorBoundary (Testimonials) - inline
      └─ ErrorBoundary (FavoriteProjects) - inline
  └─ RouteErrorBoundary (Projects)
      └─ ErrorBoundary (ProjectList) - inline
  └─ RouteErrorBoundary (Process)
```

**Reset Functionality Example:**
```typescript
// Auto-reset on route change
<RouteErrorBoundary 
  name="Home" 
  resetKeys={[location.pathname]}
>
  <Home />
</RouteErrorBoundary>
```

**Manual Error Trigger (for testing):**
```typescript
const { showBoundary } = useErrorBoundary();

const handleClick = () => {
  showBoundary(new Error('Test error'));
};
```

## Dependencies

- No new dependencies required
- Optional: Sentry SDK for production (future enhancement)

## Estimated Effort

**4-6 hours** (medium ticket)