/**
 * Swagger-Routes Sync Validation
 *
 * This test ensures swagger docs stay in sync with Express routes.
 * If you add a new route, this test will FAIL until you add swagger docs for it.
 * If you remove a route but leave stale swagger docs, this test will FAIL too.
 */
import { describe, it, expect, vi } from 'vitest';

// --- Mocks (must be before app import) ---

vi.mock('../../src/middleware/logger', () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  },
  requestLogger: vi.fn((_req, _res, next) => {
    next();
  }),
}));

vi.mock('../../src/utils/env', () => ({
  env: {
    PORT: 3000,
    NODE_ENV: 'test' as const,
    DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
    CORS_ORIGIN: 'http://localhost:5174',
    JWT_SECRET: 'test-jwt-secret-key-for-testing-purposes-only',
    JWT_EXPIRES_IN: '7d',
  },
}));

vi.mock('../../src/config/cors', () => ({
  corsOptions: {
    origin: 'http://localhost:5174',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
}));

// Import app after mocks
import app from '../../src/app';

// Import all swagger path definitions
import { healthPaths } from '../../src/docs/swagger/paths/health.paths';
import { authPaths } from '../../src/docs/swagger/paths/auth.paths';
import { projectsPaths } from '../../src/docs/swagger/paths/projects.paths';
import { categoriesPaths } from '../../src/docs/swagger/paths/categories.paths';
import { contactPaths } from '../../src/docs/swagger/paths/contact.paths';
import { testimonialsPaths } from '../../src/docs/swagger/paths/testimonials.paths';

// ---- Helpers ----

const HTTP_METHODS = ['get', 'post', 'put', 'delete', 'patch'] as const;

/**
 * Extract the mount prefix from an Express router layer's regexp.
 * Express compiles `app.use('/api/auth', router)` into a regexp like:
 *   /^\/api\/auth\/?(?=\/|$)/i
 * This function extracts "/api/auth" from that regexp.
 */
function getRouterPrefix(regexp: RegExp): string {
  const source = regexp.source;
  // Match path between ^\ and the trailing optional-slash + lookahead
  const match = source.match(/^\^\\\/(.*?)(?:\\\/)?\?\(\?[=:]/);
  if (match) {
    return '/' + match[1].replace(/\\\//g, '/');
  }
  return '';
}

/**
 * Convert Express path params (:id) to OpenAPI format ({id})
 */
function expressToOpenAPI(path: string): string {
  return path.replace(/:(\w+)/g, '{$1}');
}

/**
 * Walk Express's internal router stack and return all registered
 * API routes as a Set of "METHOD /path" strings in OpenAPI format.
 */
function getExpressRoutes(
  expressApp: typeof app,
): Set<string> {
  const routes = new Set<string>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stack: any[] = (expressApp as any)._router?.stack || [];

  for (const layer of stack) {
    if (layer.route) {
      // Direct route on app (unlikely in this codebase, but handle it)
      for (const method of Object.keys(layer.route.methods)) {
        if (HTTP_METHODS.includes(method as (typeof HTTP_METHODS)[number])) {
          routes.add(
            `${method.toUpperCase()} ${expressToOpenAPI(layer.route.path)}`,
          );
        }
      }
    } else if (layer.name === 'router') {
      // Mounted router (app.use('/prefix', router))
      const prefix = getRouterPrefix(layer.regexp);

      // Skip non-API routers (e.g. swagger-ui mounts its own router)
      if (!prefix.startsWith('/api')) continue;

      const routerStack = layer.handle?.stack || [];
      for (const routeLayer of routerStack) {
        if (!routeLayer.route) continue;
        for (const method of Object.keys(routeLayer.route.methods)) {
          if (!HTTP_METHODS.includes(method as (typeof HTTP_METHODS)[number]))
            continue;
          const routePath =
            routeLayer.route.path === '/' ? '' : routeLayer.route.path;
          const fullPath = expressToOpenAPI(prefix + routePath);
          routes.add(`${method.toUpperCase()} ${fullPath}`);
        }
      }
    }
  }

  return routes;
}

/**
 * Walk all swagger path objects and return a Set of "METHOD /path" strings.
 */
function getSwaggerRoutes(): Set<string> {
  const allPaths: Record<string, Record<string, unknown>> = {
    ...healthPaths,
    ...authPaths,
    ...projectsPaths,
    ...categoriesPaths,
    ...contactPaths,
    ...testimonialsPaths,
  };

  const routes = new Set<string>();
  for (const [path, pathItem] of Object.entries(allPaths)) {
    for (const method of HTTP_METHODS) {
      if (pathItem[method]) {
        routes.add(`${method.toUpperCase()} ${path}`);
      }
    }
  }
  return routes;
}

// ---- Tests ----

describe('Swagger ↔ Routes Sync Validation', () => {
  /**
   * Routes that are documented in swagger but NOT yet mounted in app.ts.
   * When you mount a route, REMOVE it from this set — the test will
   * then enforce that it stays documented.
   */
  const KNOWN_UNMOUNTED: Set<string> = new Set([
    // All routes are currently mounted
  ]);

  it('every Express route should be documented in Swagger', () => {
    const expressRoutes = getExpressRoutes(app);
    const swaggerRoutes = getSwaggerRoutes();

    const undocumented = [...expressRoutes].filter(
      (route) => !swaggerRoutes.has(route),
    );

    if (undocumented.length > 0) {
      expect.fail(
        `\n\nMissing Swagger docs for ${undocumented.length} route(s):\n\n` +
          undocumented.map((r) => `    ❌ ${r}`).join('\n') +
          '\n\n  Add docs in: server/src/docs/swagger/paths/\n',
      );
    }
  });

  it('every Swagger-documented route should exist in Express (or be known-unmounted)', () => {
    const expressRoutes = getExpressRoutes(app);
    const swaggerRoutes = getSwaggerRoutes();

    const orphaned = [...swaggerRoutes].filter(
      (route) => !expressRoutes.has(route) && !KNOWN_UNMOUNTED.has(route),
    );

    if (orphaned.length > 0) {
      expect.fail(
        `\n\nStale Swagger docs for ${orphaned.length} route(s):\n\n` +
          orphaned.map((r) => `    ❌ ${r}`).join('\n') +
          '\n\n  Either mount the route in app.ts, add to KNOWN_UNMOUNTED, or remove the stale docs.\n',
      );
    }
  });

  it('KNOWN_UNMOUNTED entries should not have matching Express routes (remove from set when mounted)', () => {
    const expressRoutes = getExpressRoutes(app);

    const mounted = [...KNOWN_UNMOUNTED].filter((route) =>
      expressRoutes.has(route),
    );

    if (mounted.length > 0) {
      expect.fail(
        `\n\nThese routes are now mounted — remove from KNOWN_UNMOUNTED in swagger-sync.test.ts:\n\n` +
          mounted.map((r) => `    ✅ ${r}`).join('\n') +
          '\n',
      );
    }
  });

  it('should extract the expected number of Express routes', () => {
    const expressRoutes = getExpressRoutes(app);

    // 1 health + 5 auth + 9 project + 5 category + 5 contact + 7 testimonial = 32
    expect(expressRoutes.size).toBe(32);
  });

  it('should extract the expected number of Swagger routes', () => {
    const swaggerRoutes = getSwaggerRoutes();

    // 32 routes total (all mounted)
    expect(swaggerRoutes.size).toBe(32);
  });
});
