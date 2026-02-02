---
name: API Rate Limiting
overview: Add rate limiting middleware to protect API endpoints from abuse and ensure fair usage. This will prevent excessive requests and potential DoS attacks.
todos:
  - id: rate-limit-install
    content: Install express-rate-limit package
    status: pending
  - id: rate-limit-config
    content: Create rate limiter configurations for different endpoints
    status: pending
  - id: rate-limit-middleware
    content: Create rate limiter middleware with IP-based identification
    status: pending
  - id: rate-limit-apply
    content: Apply rate limiters to routes in app.ts
    status: pending
  - id: rate-limit-error-handling
    content: Handle 429 errors in error handler
    status: pending
  - id: rate-limit-env-config
    content: Add environment variable configuration for rate limits
    status: pending
  - id: rate-limit-testing
    content: Test rate limiting functionality
    status: pending
isProject: false
---

# API Rate Limiting Implementation

## Overview

Implement rate limiting middleware for API endpoints to prevent abuse, ensure fair usage, and protect against DoS attacks. Use `express-rate-limit` package to add rate limiting to the Express server.

## Files to Create/Modify

### Backend

- `server/src/middleware/rateLimiter.ts` - Rate limiting middleware configuration
- `server/src/middleware/rateLimiter.config.ts` - Rate limit configurations for different endpoints
- `server/src/app.ts` - Apply rate limiters to routes
- `server/package.json` - Add express-rate-limit dependency
- `server/src/middleware/errorHandler.ts` - Handle rate limit errors (429 status)

## Implementation Steps

### 1. Install Dependency

```bash
npm install express-rate-limit --workspace=server
npm install --save-dev @types/express-rate-limit --workspace=server
```

### 2. Create Rate Limiter Configurations

**File**: `server/src/middleware/rateLimiter.config.ts`

- **General API Limiter**: 100 requests per 15 minutes (default)
- **Contact Form Limiter**: 5 requests per hour (prevent spam)
- **Project Creation Limiter**: 10 requests per hour (admin operations)
- **Auth Limiter**: 5 requests per 15 minutes (login attempts)

### 3. Create Rate Limiter Middleware

**File**: `server/src/middleware/rateLimiter.ts`

- Export different rate limiters for different use cases
- Configure windowMs, max requests, message
- Use IP address for identification
- Skip rate limiting in test environment
- Custom error messages in Hebrew (if needed)

### 4. Apply Rate Limiters

**File**: `server/src/app.ts`

- Apply general limiter to all `/api/*` routes
- Apply specific limiters to sensitive endpoints:
  - Contact form: stricter limits
  - Project creation/update: moderate limits
  - Auth endpoints: strict limits (when implemented)

### 5. Error Handling

**File**: `server/src/middleware/errorHandler.ts`

- Handle 429 (Too Many Requests) errors
- Return appropriate error message
- Include retry-after header information

### 6. Configuration

- Make rate limits configurable via environment variables
- Different limits for development vs production
- Document rate limits in API documentation

## Rate Limit Configurations

### General API Rate Limiter

- **Window**: 15 minutes
- **Max Requests**: 100 per IP
- **Message**: "Too many requests, please try again later"

### Contact Form Rate Limiter

- **Window**: 1 hour
- **Max Requests**: 5 per IP
- **Message**: "Too many contact form submissions, please try again later"
- **Skip Successful Requests**: No (count all attempts)

### Project Operations Rate Limiter

- **Window**: 1 hour
- **Max Requests**: 10 per IP
- **Message**: "Too many project operations, please try again later"

### Auth Rate Limiter (Future)

- **Window**: 15 minutes
- **Max Requests**: 5 per IP
- **Message**: "Too many login attempts, please try again later"

## Implementation Details

### Rate Limiter Structure

```typescript
interface RateLimitConfig {
  windowMs: number;
  max: number;
  message: string;
  standardHeaders: boolean;
  legacyHeaders: boolean;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}
```

### Environment Variables

- `RATE_LIMIT_WINDOW_MS` - Default window in milliseconds
- `RATE_LIMIT_MAX_REQUESTS` - Default max requests
- `RATE_LIMIT_ENABLED` - Enable/disable rate limiting (default: true)

### Error Response Format

```json
{
  "error": "Too Many Requests",
  "message": "Too many requests, please try again later",
  "retryAfter": 900
}
```

## Key Considerations

- Use IP address for identification (can be enhanced with user ID when auth is added)
- Skip rate limiting in test environment
- Different limits for different endpoint types
- Return Retry-After header for client guidance
- Log rate limit violations for monitoring
- Consider using Redis for distributed rate limiting in production (future)
- Don't rate limit health check endpoint

## Testing

- Test rate limiting with multiple requests
- Test rate limit reset after window expires
- Test different limiters on different routes
- Test error response format
- Test rate limiting disabled in test environment

## Production Considerations

- Consider Redis store for distributed rate limiting
- Monitor rate limit violations
- Adjust limits based on usage patterns
- Consider different limits for authenticated vs anonymous users

## Notes

- Rate limiting is per IP address (can be enhanced later)
- Health check endpoint should not be rate limited
- Consider adding rate limit headers to responses
- Can be extended to support different limits per user role (when auth is added)
