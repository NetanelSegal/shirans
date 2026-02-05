# Implement Comprehensive Backend Rate Limiting

## Overview

Expand rate limiting from auth-only endpoints to comprehensive, tiered rate limiting across all API endpoints to protect against abuse, DDoS attacks, and ensure fair resource usage.

**Related Spec:** `spec:579384fa-c272-4cf0-a25d-99217963dda6/a153507e-4b52-46c9-9af3-c71fcb107fa7`

## Tasks

### 1. Create Rate Limit Constants

**Files to create:**
- `file:server/src/constants/rateLimits.constants.ts`

**Implementation:**
- Define rate limit configurations for all tiers:
  - **STRICT**: 5 req/15min (auth endpoints)
  - **MEDIUM**: 10 req/15min (public writes - contact form)
  - **LENIENT**: 100 req/15min (public reads - projects, categories)
  - **ADMIN**: 50 req/15min (admin operations)
- Include window duration (15 minutes)
- Include custom error messages (Hebrew support)
- Make configurable via environment variables

### 2. Enhance Rate Limiter Middleware

**Files to modify:**
- `file:server/src/middleware/rateLimiter.ts`

**Implementation:**
- Create factory function `createLimiter(config)` for DRY code
- Create and export multiple limiter instances:
  - `strictLimiter` (existing authLimiter)
  - `mediumLimiter` (new)
  - `lenientLimiter` (new)
  - `adminLimiter` (new)
- Configure standard headers for all limiters
- Maintain backward compatibility: `export const authLimiter = strictLimiter`
- Skip rate limiting in test environment
- Add custom error handler with Hebrew messages

### 3. Configure Trust Proxy

**Files to modify:**
- `file:server/src/app.ts`

**Actions:**
- Add `app.set('trust proxy', 1)` for accurate IP tracking
- Add comment explaining proxy configuration
- Ensure this is set before rate limiters are applied

### 4. Apply Rate Limiting to Contact Routes

**Files to modify:**
- `file:server/src/routes/contact.routes.ts`

**Actions:**
- Import `mediumLimiter` and `lenientLimiter`
- Apply `mediumLimiter` to POST /api/contact (prevent spam)
- Apply `lenientLimiter` to admin GET routes
- Update comments to document rate limiting

### 5. Apply Rate Limiting to Project Routes

**Files to modify:**
- `file:server/src/routes/project.routes.ts`

**Actions:**
- Import `lenientLimiter` and `adminLimiter`
- Apply `lenientLimiter` to all public GET routes:
  - GET /api/projects
  - GET /api/projects/favourites
  - GET /api/projects/single
- Apply `adminLimiter` to all admin routes (POST, PUT, DELETE)
- Update comments to document rate limiting

### 6. Apply Rate Limiting to Category Routes

**Files to modify:**
- `file:server/src/routes/category.routes.ts`

**Actions:**
- Import `lenientLimiter` and `adminLimiter`
- Apply `lenientLimiter` to public GET routes:
  - GET /api/categories
  - GET /api/categories/:id
- Apply `adminLimiter` to admin routes (POST, PUT, DELETE)
- Update comments to document rate limiting

### 7. Add Environment Variables

**Files to modify:**
- `file:server/.env.example`

**Actions:**
- Add rate limiting configuration variables:
  ```
  # Rate Limiting
  RATE_LIMIT_STRICT_MAX=5
  RATE_LIMIT_MEDIUM_MAX=10
  RATE_LIMIT_LENIENT_MAX=100
  RATE_LIMIT_ADMIN_MAX=50
  RATE_LIMIT_WINDOW_MS=900000
  ```
- Document each variable

### 8. Add Rate Limit Logging

**Files to modify:**
- `file:server/src/middleware/rateLimiter.ts`

**Implementation:**
- Add custom handler to log rate limit violations
- Use existing logger from `file:server/src/middleware/logger.ts`
- Log: IP address, endpoint, method, timestamp
- Include in all limiter configurations

### 9. Update Tests

**Files to modify:**
- `file:server/test/integration/auth.routes.test.ts`
- `file:server/test/integration/project.routes.test.ts`

**Actions:**
- Verify rate limiting is skipped in test environment
- Add integration tests for rate limiting (optional):
  - Test rate limit enforcement
  - Test rate limit headers
  - Test 429 responses
  - Test reset after window

### 10. Test Rate Limiting System

**Testing checklist:**
- ✅ Strict limiter on auth routes (5 req/15min)
- ✅ Medium limiter on contact form (10 req/15min)
- ✅ Lenient limiter on public reads (100 req/15min)
- ✅ Admin limiter on admin operations (50 req/15min)
- ✅ Rate limit headers returned (RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset)
- ✅ 429 status code on limit exceeded
- ✅ Custom error messages (Hebrew)
- ✅ Rate limiting skipped in test environment
- ✅ Logging works on rate limit violations
- ✅ Trust proxy configuration working (accurate IP tracking)

## Acceptance Criteria

- [ ] Rate limit constants created with all 4 tiers
- [ ] Rate limiter middleware enhanced with 4 limiter instances
- [ ] Trust proxy configured in app.ts
- [ ] Rate limiting applied to all contact routes
- [ ] Rate limiting applied to all project routes
- [ ] Rate limiting applied to all category routes
- [ ] Environment variables added to .env.example
- [ ] Rate limit violations logged
- [ ] All integration tests passing
- [ ] Rate limiting tested manually on all endpoint types
- [ ] Rate limit headers verified in responses
- [ ] 429 responses verified with Hebrew error messages
- [ ] No performance degradation (<5ms overhead)

## Technical Notes

**Rate Limit Tiers:**

| Tier | Window | Max | Endpoints |
|------|--------|-----|-----------|
| Strict | 15min | 5 | `/api/auth/*` |
| Medium | 15min | 10 | `POST /api/contact` |
| Lenient | 15min | 100 | `GET /api/projects/*`, `GET /api/categories/*` |
| Admin | 15min | 50 | Admin POST/PUT/DELETE |

**Limiter Factory Example:**
```typescript
const createLimiter = (config: RateLimitConfig) => {
  return rateLimit({
    windowMs: config.windowMs,
    max: config.max,
    message: config.message,
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => env.NODE_ENV === 'test',
    handler: (req, res) => {
      logger.warn('Rate limit exceeded', {
        ip: req.ip,
        path: req.path,
        method: req.method,
      });
      res.status(429).json({
        success: false,
        message: config.message,
      });
    },
  });
};
```

**Route Application Example:**
```typescript
// Public write - medium limit
router.post('/', mediumLimiter, submitContact);

// Public read - lenient limit
router.get('/', lenientLimiter, getAllProjects);

// Admin write - admin limit
router.post('/', adminLimiter, authenticate, requireAdmin, createProject);
```

## Dependencies

- ✅ express-rate-limit (already installed)
- No new dependencies required

## Estimated Effort

**3-4 hours** (small-medium ticket)