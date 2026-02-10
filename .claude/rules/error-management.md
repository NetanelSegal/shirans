# Error Management Standards

## Core Rules

1. Never use magic numbers - always `HTTP_STATUS` constants
2. Never hardcode error messages - always `ERROR_MESSAGES` constants
3. Handle Prisma database errors explicitly
4. Use `HttpError` class directly, no complex hierarchies

## File Locations

- HTTP Status Constants: `server/src/constants/httpStatus.ts`
- Error Messages: `server/src/constants/errorMessages.ts`
- HttpError Class: `server/src/middleware/errorHandler.ts`

## Usage Pattern

```typescript
import { HTTP_STATUS } from '../constants/httpStatus';
import { ERROR_MESSAGES } from '../constants/errorMessages';
import { HttpError } from '../middleware/errorHandler';

// Throw errors with constants
throw new HttpError(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.NOT_FOUND.USER_NOT_FOUND);

// Dynamic messages use functions
throw new HttpError(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.NOT_FOUND.PROJECT_NOT_FOUND(id));
```

## Available Constants

**HTTP_STATUS**: BAD_REQUEST (400), UNAUTHORIZED (401), FORBIDDEN (403), NOT_FOUND (404), CONFLICT (409), INTERNAL_SERVER_ERROR (500)

**ERROR_MESSAGES categories**: AUTH, VALIDATION, NOT_FOUND, CONFLICT, SERVER

## Prisma Error Handling

- P2002 (Unique constraint) -> `HTTP_STATUS.CONFLICT`
- P2025 (Record not found) -> `HTTP_STATUS.NOT_FOUND`
- P2003 (Foreign key violation) -> `HTTP_STATUS.BAD_REQUEST`

```typescript
if (error instanceof Prisma.PrismaClientKnownRequestError) {
  if (error.code === 'P2002') {
    throw new HttpError(HTTP_STATUS.CONFLICT, ERROR_MESSAGES.CONFLICT.EMAIL_ALREADY_EXISTS);
  }
}
```

## Service Error Pattern

```typescript
async someOperation() {
  try {
    // operation logic
  } catch (error) {
    if (error instanceof HttpError) throw error;  // re-throw as-is
    logger.error('Operation failed', { error });
    throw new HttpError(HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.SERVER.OPERATION_FAILED);
  }
}
```

## Adding New Error Messages

1. Add to appropriate category in `server/src/constants/errorMessages.ts`
2. Use descriptive names: `USER_NOT_FOUND`, not `NOT_FOUND`
3. Use functions for dynamic content: `(id: string) => \`Resource ${id} not found\``
4. Keep messages user-friendly
