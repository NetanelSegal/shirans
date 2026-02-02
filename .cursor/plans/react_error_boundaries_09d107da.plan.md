---
name: React Error Boundaries
overview: Add React error boundaries to improve error handling and user experience. Currently, errors in React components can crash the entire app. Error boundaries will catch errors and display fallback UI.
todos:
  - id: error-boundary-component
    content: Create ErrorBoundary class component with error catching
    status: pending
  - id: error-fallback-ui
    content: Create ErrorFallback component with Hebrew UI and recovery actions
    status: pending
  - id: error-boundary-app-level
    content: Wrap App component with error boundary
    status: pending
  - id: error-boundary-page-level
    content: Add error boundaries to individual pages (optional)
    status: pending
  - id: error-logging
    content: Add error logging functionality
    status: pending
  - id: error-boundary-testing
    content: Test error boundaries with intentional errors
    status: pending
isProject: false
---

# React Error Boundaries Implementation

## Overview

Implement React error boundaries throughout the application to catch component errors and display fallback UI instead of crashing the entire app. This improves user experience and makes the app more resilient.

## Files to Create/Modify

### Frontend

- `client/src/components/ErrorBoundary/ErrorBoundary.tsx` - Main error boundary component
- `client/src/components/ErrorBoundary/ErrorFallback.tsx` - Fallback UI component
- `client/src/components/ErrorBoundary/index.tsx` - Export file
- `client/src/App.tsx` - Wrap app with error boundary
- `client/src/pages/Home/Home.tsx` - Add error boundary (optional, per-page)
- `client/src/pages/Projects/Projects.tsx` - Add error boundary (optional)
- `client/src/pages/Project/Project.tsx` - Add error boundary (optional)
- `client/src/components/Layout/Layout.tsx` - Add error boundary (optional)

## Implementation Steps

### 1. Create ErrorBoundary Component

**File**: `client/src/components/ErrorBoundary/ErrorBoundary.tsx`

- Class component (error boundaries must be class components)
- Implement `componentDidCatch` lifecycle method
- Track error state
- Provide reset functionality
- Accept `fallback` prop for custom UI
- Accept `onError` callback for logging

### 2. Create ErrorFallback Component

**File**: `client/src/components/ErrorBoundary/ErrorFallback.tsx`

- Display user-friendly error message (Hebrew)
- Show error details in development mode
- Provide "Try Again" button
- Provide "Go Home" navigation link
- Styled with Tailwind CSS

### 3. Integration Points

- **App Level**: Wrap entire app in `App.tsx` (catches all errors)
- **Page Level**: Wrap individual pages (catches page-specific errors)
- **Component Level**: Wrap critical components (catches component errors)

### 4. Error Logging

- Log errors to console in development
- Optionally send errors to error tracking service (Sentry, etc.)
- Include error message, stack trace, component stack

### 5. Error Recovery

- Provide "Try Again" button to reset error boundary
- Provide navigation to safe pages (Home, Projects)
- Clear error state on navigation

## Implementation Details

### ErrorBoundary Component Structure

```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}
```

### ErrorFallback Component

- Display Hebrew error message: "אירעה שגיאה. אנא נסה שוב."
- Show technical details in development mode
- Provide action buttons
- Match design system (use existing components/styles)

### Strategic Placement

1. **Root Level** (`App.tsx`): Catch all unhandled errors
2. **Page Level**: Catch errors in specific pages (Home, Projects, Project)
3. **Critical Components**: Wrap data-fetching components (ProjectsProvider, etc.)

## Key Considerations

- Error boundaries only catch errors in render, lifecycle methods, and constructors
- They don't catch errors in event handlers, async code, or SSR
- Use multiple boundaries for granular error handling
- Log errors for debugging but don't expose sensitive info
- Provide clear recovery paths for users
- Match Hebrew RTL design
- Follow React best practices for error boundaries

## Testing

- Test error boundary with intentional errors
- Test error recovery (Try Again button)
- Test navigation from error state
- Test error logging
- Test fallback UI display

## Error Types to Handle

- Component render errors
- Data fetching errors (if not handled elsewhere)
- Prop validation errors
- State update errors
- Third-party library errors

## Notes

- Error boundaries are class components (React limitation)
- Consider adding error tracking service integration later
- Can be extended to show different fallbacks for different error types
- Works well with Suspense boundaries for loading states
