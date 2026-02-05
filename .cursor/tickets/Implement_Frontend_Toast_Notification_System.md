# Implement Frontend Toast Notification System

## Overview

Implement a comprehensive toast notification system using Sonner library to provide user feedback for actions, errors, warnings, and success messages across the application.

**Related Spec:** `spec:579384fa-c272-4cf0-a25d-99217963dda6/a335ba05-e5ca-4d43-9295-cf3fc3074aaf`

## Tasks

### 1. Install and Configure Sonner

**Files to modify:**
- `file:client/package.json`

**Actions:**
- Install sonner package: `npm install sonner`
- Verify installation and version

### 2. Create Toast Provider Component

**Files to create:**
- `file:client/src/components/ui/Toast/index.tsx`
- `file:client/src/components/ui/Toast/ToastProvider.tsx`

**Implementation:**
- Create ToastProvider component wrapping Sonner's Toaster
- Configure default options:
  - Position: `top-right`
  - Duration: 4000ms
  - RTL support: `dir="rtl"`
  - Max visible toasts: 3
  - Close button: enabled
- Apply Tailwind styling for consistency with design system
- Export ToastProvider from index

### 3. Create useToast Hook

**Files to create:**
- `file:client/src/hooks/useToast.ts`

**Implementation:**
- Create wrapper hook around sonner's toast function
- Export typed methods:
  - `toast.success(message, options?)`
  - `toast.error(message, options?)`
  - `toast.warning(message, options?)`
  - `toast.info(message, options?)`
  - `toast.promise(promise, messages)`
- Support custom options (duration, action buttons)
- Add TypeScript types for all methods

### 4. Integrate Toast Provider in App

**Files to modify:**
- `file:client/src/App.tsx`

**Actions:**
- Import ToastProvider
- Add ToastProvider wrapper after HelmetProvider
- Ensure proper z-index for toasts (above all content)

### 5. Enhance Error Handler with Toast Integration

**Files to modify:**
- `file:client/src/utils/errorHandler.ts`

**Implementation:**
- Import useToast (or toast directly from sonner)
- Update `logError()` function to optionally trigger error toasts
- Add parameter: `showToast?: boolean = true`
- Map error types to appropriate toast variants
- Prevent duplicate toasts for same error (debounce/throttle)

### 6. Add Success Toasts to Key User Actions

**Files to modify:**
- `file:client/src/pages/Auth/Login.tsx`
- `file:client/src/pages/Auth/Register.tsx`
- `file:client/src/components/Footer/hooks/useEmailSend.tsx`

**Implementation:**
- Add success toast on successful login: "התחברת בהצלחה"
- Add success toast on successful registration: "נרשמת בהצלחה"
- Add success toast on email send: "ההודעה נשלחה בהצלחה"
- Add error toasts for failures (already handled by error handler)

### 7. Test Toast System

**Testing checklist:**
- ✅ All 4 toast types display correctly (success, error, warning, info)
- ✅ RTL text displays properly
- ✅ Auto-dismiss works after 4 seconds
- ✅ Manual dismiss via close button works
- ✅ Multiple toasts stack correctly (max 3 visible)
- ✅ Toasts appear above all content (z-index)
- ✅ Accessibility: screen reader announcements work
- ✅ Keyboard navigation works (Tab to close button, Enter to dismiss)
- ✅ Integration with error handler works
- ✅ Success toasts on user actions work

## Acceptance Criteria

- [ ] Sonner package installed and configured
- [ ] ToastProvider component created and integrated in App.tsx
- [ ] useToast hook created with all 4 toast types
- [ ] Error handler enhanced to trigger toasts
- [ ] At least 3 user actions show success toasts (login, register, contact form)
- [ ] All toast types tested and working
- [ ] RTL support verified
- [ ] Accessibility compliance verified (WCAG 2.1 AA)
- [ ] No console errors or warnings
- [ ] Toast styling matches existing design system

## Technical Notes

**Sonner Configuration Example:**
```typescript
<Toaster 
  position="top-right"
  dir="rtl"
  duration={4000}
  visibleToasts={3}
  closeButton
  richColors
/>
```

**useToast Hook Example:**
```typescript
import { toast as sonnerToast } from 'sonner';

export const useToast = () => {
  return {
    toast: {
      success: (message: string, options?) => sonnerToast.success(message, options),
      error: (message: string, options?) => sonnerToast.error(message, options),
      warning: (message: string, options?) => sonnerToast.warning(message, options),
      info: (message: string, options?) => sonnerToast.info(message, options),
      promise: sonnerToast.promise,
    }
  };
};
```

## Dependencies

- Sonner package (~3KB gzipped)
- No breaking changes to existing code

## Estimated Effort

**2-3 hours** (small ticket)