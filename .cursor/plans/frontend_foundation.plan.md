---
name: Frontend Foundation
overview: Set up frontend infrastructure including constants, error handling, token management, and API client. This is the foundation for all frontend API integration.
todos:
  - id: frontend-http-status
    content: Create frontend HTTP_STATUS constants (import from shared)
    status: pending
  - id: frontend-error-messages
    content: Create frontend error message constants (Hebrew, using ERROR_KEYS)
    status: pending
  - id: frontend-error-types
    content: Create frontend error types (import from shared)
    status: pending
  - id: token-storage-utility
    content: Create token storage utility for access tokens
    status: pending
  - id: api-client-base
    content: Create API client base setup (axios instance)
    status: pending
  - id: api-client-request-interceptor
    content: Add request interceptor to API client (Authorization header)
    status: pending
  - id: api-client-response-interceptor
    content: Add response interceptor with error handling
    status: pending
  - id: error-handler-utility
    content: Create error handler utility (transformError, handleError, logError)
    status: pending
  - id: error-handler-hook
    content: Create useErrorHandler hook
    status: pending
  - id: error-display-component
    content: Create ErrorDisplay component
    status: pending
  - id: error-boundary-component
    content: Create ErrorBoundary component
    status: pending
  - id: add-missing-endpoints
    content: Add missing API endpoints to urls.ts (refresh, contact, categories)
    status: pending
isProject: false
---

# Frontend Foundation

## Overview

Set up the foundational infrastructure for frontend API integration, including constants, error handling, token management, and API client configuration. This must be completed before authentication and API integration work.

## Dependencies

- ✅ Shared package foundation must be completed first
- ✅ Backend API endpoints should exist (or be planned)

## Files to Create

### Constants

- `client/src/constants/httpStatus.ts` - Import HTTP_STATUS from shared
- `client/src/constants/errorMessages.ts` - Hebrew error messages using ERROR_KEYS

### Types

- `client/src/types/error.types.ts` - Import and extend error types

### Utilities

- `client/src/utils/tokenStorage.ts` - Token storage functions
- `client/src/utils/apiClient.ts` - Axios instance with interceptors
- `client/src/utils/errorHandler.ts` - Error handling utilities

### Hooks

- `client/src/hooks/useErrorHandler.ts` - Error handling hook

### Components

- `client/src/components/ErrorDisplay/ErrorDisplay.tsx` - Error display component
- `client/src/components/ErrorBoundary/ErrorBoundary.tsx` - Error boundary component

## Files to Modify

- `client/src/constants/urls.ts` - Add missing endpoints

## Implementation Details

### 1. Frontend HTTP Status Constants

**File**: `client/src/constants/httpStatus.ts`

```typescript
/**
 * HTTP Status Code Constants (Frontend)
 * Re-export from shared package
 */
export { HTTP_STATUS, type HttpStatus } from '@shirans/shared';
```

### 2. Frontend Error Messages (Hebrew)

**File**: `client/src/constants/errorMessages.ts`

```typescript
import { ERROR_KEYS } from '@shirans/shared';

/**
 * Frontend Error Messages (Hebrew)
 * Uses shared ERROR_KEYS for consistency
 */
export const ERROR_MESSAGES = {
  [ERROR_KEYS.AUTH.INVALID_CREDENTIALS]: 'אימייל או סיסמה שגויים',
  [ERROR_KEYS.AUTH.TOKEN_REQUIRED]: 'נדרש אימות',
  [ERROR_KEYS.AUTH.TOKEN_INVALID]: 'פג תוקף ההתחברות. אנא התחבר שוב',
  // ... (see FRONTEND_ERROR_HANDLING_STRATEGY.md for full list)
} as const;
```

### 3. Frontend Error Types

**File**: `client/src/types/error.types.ts`

```typescript
import { ApiErrorResponse } from '@shirans/shared';
import { HTTP_STATUS } from '../constants/httpStatus';

/**
 * Frontend Error Object
 */
export interface AppError {
  statusCode: number;
  message: string;
  originalError?: unknown;
  isNetworkError?: boolean;
  isAuthError?: boolean;
}

/**
 * Error Handler Result
 */
export interface ErrorHandlerResult {
  message: string;
  statusCode: number;
  shouldRetry: boolean;
  shouldLogout: boolean;
}

export type { ApiErrorResponse };
```

### 4. Token Storage Utility

**File**: `client/src/utils/tokenStorage.ts`

```typescript
const ACCESS_TOKEN_KEY = 'accessToken';

export function getAccessToken(): string | null {
  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAccessToken(token: string): void {
  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  } catch {
    // Handle storage errors (quota exceeded, etc.)
  }
}

export function removeAccessToken(): void {
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  } catch {
    // Ignore errors
  }
}
```

### 5. API Client Base Setup

**File**: `client/src/utils/apiClient.ts` (partial)

```typescript
import axios from 'axios';
import { MAIN_URL } from '../constants/urls';

const apiClient = axios.create({
  baseURL: MAIN_URL,
  timeout: 10000,
  withCredentials: true, // For httpOnly cookies (refresh tokens)
});

export default apiClient;
```

### 6. Request Interceptor

**File**: `client/src/utils/apiClient.ts` (update)

```typescript
import { getAccessToken } from './tokenStorage';

// Request interceptor: Add Authorization header
apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 7. Response Interceptor with Error Handling

**File**: `client/src/utils/apiClient.ts` (update)

```typescript
import { HTTP_STATUS } from '../constants/httpStatus';
import { transformError } from './errorHandler';

// Response interceptor: Handle errors and transform
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const appError = transformError(error);

    // Handle 401 - Token refresh will be added in auth context
    if (appError.statusCode === HTTP_STATUS.UNAUTHORIZED) {
      // Token refresh logic will be added later
    }

    return Promise.reject(appError);
  }
);
```

### 8. Error Handler Utility

**File**: `client/src/utils/errorHandler.ts`

See `FRONTEND_ERROR_HANDLING_STRATEGY.md` for complete implementation.

Key functions:

- `isAxiosError()` - Check if error is Axios error
- `isNetworkError()` - Check if network error
- `extractApiErrorMessage()` - Extract message from API response
- `getErrorMessageForStatus()` - Map status code to Hebrew message
- `transformError()` - Transform any error to AppError format
- `handleError()` - Handle error and determine action
- `logError()` - Log error (console in dev, service in prod)

### 9. useErrorHandler Hook

**File**: `client/src/hooks/useErrorHandler.ts`

```typescript
import { useCallback } from 'react';
import { transformError, logError } from '../utils/errorHandler';
import { AppError } from '../types/error.types';

export function useErrorHandler() {
  const handleError = useCallback(
    (error: unknown, context?: string): AppError => {
      logError(error, context);
      return transformError(error);
    },
    []
  );

  return { handleError };
}
```

### 10. ErrorDisplay Component

**File**: `client/src/components/ErrorDisplay/ErrorDisplay.tsx`

```typescript
import { AppError } from '@/types/error.types';

interface ErrorDisplayProps {
  error: AppError | null;
  onRetry?: () => void;
  className?: string;
}

export function ErrorDisplay({ error, onRetry, className }: ErrorDisplayProps) {
  if (!error) return null;

  return (
    <div className={`error-display ${className || ''}`} dir="rtl">
      <div className="error-message">{error.message}</div>
      {onRetry && error.isNetworkError && (
        <button onClick={onRetry} className="retry-button">
          נסה שוב
        </button>
      )}
    </div>
  );
}
```

### 11. ErrorBoundary Component

**File**: `client/src/components/ErrorBoundary/ErrorBoundary.tsx`

```typescript
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logError } from '@/utils/errorHandler';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logError(error, 'ErrorBoundary');
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div dir="rtl">
          <h1>אירעה שגיאה</h1>
          <p>אנא רענן את הדף או נסה שוב מאוחר יותר.</p>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### 12. Add Missing Endpoints

**File**: `client/src/constants/urls.ts` (update)

```typescript
// Add to existing urls object:
auth: {
  // ... existing endpoints
  refresh: `${MAIN_URL}/api/auth/refresh`, // ADD THIS
},
contact: {
  submit: `${MAIN_URL}/api/contact`, // ADD THIS
},
categories: {
  getAll: `${MAIN_URL}/api/categories`, // ADD THIS
},
```

## Testing

- Test token storage functions
- Test API client interceptors
- Test error handler utility with various error types
- Test ErrorDisplay component rendering
- Test ErrorBoundary catching errors

## Notes

- All error messages are in Hebrew (RTL)
- Follows error management rules from `.cursor/rules/error-management.mdc`
- Uses shared constants for SSOT
- Token refresh logic will be added in auth context
