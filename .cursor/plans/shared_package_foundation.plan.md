---
name: Shared Package Foundation
overview: Create shared package for HTTP_STATUS and ERROR_KEYS constants that will be used by both frontend and backend. This is a critical blocker that must be completed first.
todos:
  - id: shared-package-structure
    content: Create shared package structure (package.json, tsconfig.json, index.ts)
    status: pending
  - id: shared-http-status
    content: Create HTTP_STATUS constants in shared package
    status: pending
  - id: shared-error-keys
    content: Create ERROR_KEYS constants in shared package
    status: pending
  - id: shared-error-types
    content: Create error type definitions in shared package
    status: pending
  - id: root-workspace-config
    content: Update root package.json to include shared in workspaces
    status: pending
isProject: false
---

# Shared Package Foundation

## Overview

Create a `shared/` package that contains HTTP status constants and error keys that will be used by both frontend and backend. This ensures Single Source of Truth (SSOT) and prevents duplication.

## Files to Create

- `shared/package.json` - Package configuration
- `shared/tsconfig.json` - TypeScript configuration
- `shared/src/index.ts` - Main export file
- `shared/src/constants/httpStatus.ts` - HTTP status constants
- `shared/src/errors/errorKeys.ts` - Error key constants
- `shared/src/types/error.types.ts` - Error type definitions

## Files to Modify

- `package.json` (root) - Add shared to workspaces

## Implementation Steps

### 1. Create Shared Package Structure

**File**: `shared/package.json`

```json
{
  "name": "@shirans/shared",
  "version": "1.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "type-check": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
```

**File**: `shared/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "outDir": "./dist"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**File**: `shared/src/index.ts`

```typescript
export * from './constants/httpStatus';
export * from './errors/errorKeys';
export * from './types/error.types';
```

### 2. Create HTTP Status Constants

**File**: `shared/src/constants/httpStatus.ts`

```typescript
/**
 * HTTP Status Code Constants
 * Shared between frontend and backend
 * Single Source of Truth (SSOT)
 */
export const HTTP_STATUS = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export type HttpStatus = typeof HTTP_STATUS[keyof typeof HTTP_STATUS];
```

### 3. Create Error Keys Constants

**File**: `shared/src/errors/errorKeys.ts`

```typescript
/**
 * Error Keys - Used to identify error types
 * Shared between frontend and backend
 */
export const ERROR_KEYS = {
  AUTH: {
    INVALID_CREDENTIALS: 'AUTH.INVALID_CREDENTIALS',
    TOKEN_REQUIRED: 'AUTH.TOKEN_REQUIRED',
    TOKEN_INVALID: 'AUTH.TOKEN_INVALID',
    REFRESH_TOKEN_REQUIRED: 'AUTH.REFRESH_TOKEN_REQUIRED',
    REFRESH_TOKEN_INVALID: 'AUTH.REFRESH_TOKEN_INVALID',
    AUTHENTICATION_REQUIRED: 'AUTH.AUTHENTICATION_REQUIRED',
    ADMIN_ACCESS_REQUIRED: 'AUTH.ADMIN_ACCESS_REQUIRED',
    TOKEN_REUSE_DETECTED: 'AUTH.TOKEN_REUSE_DETECTED',
  },
  VALIDATION: {
    INVALID_INPUT: 'VALIDATION.INVALID_INPUT',
    REQUIRED_FIELD: 'VALIDATION.REQUIRED_FIELD',
    INVALID_EMAIL: 'VALIDATION.INVALID_EMAIL',
    INVALID_PHONE: 'VALIDATION.INVALID_PHONE',
    PASSWORD_TOO_SHORT: 'VALIDATION.PASSWORD_TOO_SHORT',
    PASSWORD_WEAK: 'VALIDATION.PASSWORD_WEAK',
    IMAGES_NOT_BELONG_TO_PROJECT: 'VALIDATION.IMAGES_NOT_BELONG_TO_PROJECT',
  },
  NOT_FOUND: {
    USER_NOT_FOUND: 'NOT_FOUND.USER_NOT_FOUND',
    PROJECT_NOT_FOUND: 'NOT_FOUND.PROJECT_NOT_FOUND',
    CATEGORY_NOT_FOUND: 'NOT_FOUND.CATEGORY_NOT_FOUND',
    MAIN_IMAGE_NOT_FOUND: 'NOT_FOUND.MAIN_IMAGE_NOT_FOUND',
    PAGE_NOT_FOUND: 'NOT_FOUND.PAGE_NOT_FOUND',
    RESOURCE_NOT_FOUND: 'NOT_FOUND.RESOURCE_NOT_FOUND',
  },
  CONFLICT: {
    EMAIL_ALREADY_EXISTS: 'CONFLICT.EMAIL_ALREADY_EXISTS',
    PROJECT_TITLE_EXISTS: 'CONFLICT.PROJECT_TITLE_EXISTS',
  },
  SERVER: {
    REGISTRATION_FAILED: 'SERVER.REGISTRATION_FAILED',
    LOGIN_FAILED: 'SERVER.LOGIN_FAILED',
    FETCH_USER_FAILED: 'SERVER.FETCH_USER_FAILED',
    REFRESH_TOKEN_FAILED: 'SERVER.REFRESH_TOKEN_FAILED',
    FETCH_PROJECTS_FAILED: 'SERVER.FETCH_PROJECTS_FAILED',
    FETCH_FAVOURITE_PROJECTS_FAILED: 'SERVER.FETCH_FAVOURITE_PROJECTS_FAILED',
    CREATE_PROJECT_FAILED: 'SERVER.CREATE_PROJECT_FAILED',
    UPDATE_PROJECT_FAILED: 'SERVER.UPDATE_PROJECT_FAILED',
    DELETE_PROJECT_FAILED: 'SERVER.DELETE_PROJECT_FAILED',
    SUBMIT_CONTACT_FAILED: 'SERVER.SUBMIT_CONTACT_FAILED',
  },
  NETWORK: {
    CONNECTION_ERROR: 'NETWORK.CONNECTION_ERROR',
    TIMEOUT: 'NETWORK.TIMEOUT',
    SERVER_ERROR: 'NETWORK.SERVER_ERROR',
    UNKNOWN_ERROR: 'NETWORK.UNKNOWN_ERROR',
  },
} as const;

export type ErrorKey = typeof ERROR_KEYS[keyof typeof ERROR_KEYS][keyof typeof ERROR_KEYS[keyof typeof ERROR_KEYS]];
```

### 4. Create Error Types

**File**: `shared/src/types/error.types.ts`

```typescript
/**
 * API Error Response (matches backend format)
 * Shared type definition
 */
export interface ApiErrorResponse {
  error: string;
  message: string;
  stack?: string;
}
```

### 5. Update Root Package.json

**File**: `package.json` (root)

Add `shared` to workspaces array:

```json
{
  "workspaces": [
    "client",
    "server",
    "shared"
  ]
}
```

## Testing

After creating the shared package:

1. Run `npm install` from root to link workspaces
2. Verify TypeScript compilation: `cd shared && npm run type-check`
3. Test imports from client: `import { HTTP_STATUS } from '@shirans/shared'`
4. Test imports from server: `import { HTTP_STATUS } from '@shirans/shared'`

## Notes

- This is a **CRITICAL BLOCKER** - other tasks depend on this
- Must be completed before frontend/backend constants work
- Follows monorepo best practices
- Ensures SSOT for constants
