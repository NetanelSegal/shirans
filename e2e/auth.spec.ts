import { test, expect } from '@playwright/test';

const SERVER_URL = process.env.PLAYWRIGHT_SERVER_URL || 'http://localhost:3000';
const API_URL = `${SERVER_URL}/api/auth`;

const TEST_PASSWORD = 'Password123!';
const TEST_NAME = 'Test User';

/** Generate a unique email for each test to avoid parallel conflicts */
function uniqueEmail(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}@example.com`;
}

/** Register a user and return the accessToken */
async function registerUser(request: { post: Function }, email: string) {
  const response = await request.post(`${API_URL}/register`, {
    data: { email, password: TEST_PASSWORD, name: TEST_NAME },
  });
  return response;
}

test.describe('Authentication Flow', () => {
  test.describe('POST /api/auth/register', () => {
    test('should register a new user successfully', async ({ request }) => {
      const email = uniqueEmail('reg-success');
      const response = await registerUser(request, email);

      expect(response.status()).toBe(201);
      const body = await response.json();
      expect(body).toHaveProperty('user');
      expect(body).toHaveProperty('accessToken');
      expect(body.user).toHaveProperty('email', email);
      expect(body.user).toHaveProperty('name', TEST_NAME);
      expect(body.user).toHaveProperty('role');
      expect(body.user).not.toHaveProperty('password');
      expect(typeof body.accessToken).toBe('string');
      expect(body.accessToken.length).toBeGreaterThan(0);
    });

    test('should return 409 when email already exists', async ({ request }) => {
      const email = uniqueEmail('reg-dup');

      // First registration
      await registerUser(request, email);

      // Try to register again with same email
      const response = await registerUser(request, email);

      expect(response.status()).toBe(409);
      const body = await response.json();
      expect(body).toHaveProperty('error');
      expect(body.message).toContain('already registered');
    });

    test('should return 400 when validation fails - invalid email', async ({ request }) => {
      const response = await request.post(`${API_URL}/register`, {
        data: {
          email: `invalid-email-${Date.now()}`,
          password: TEST_PASSWORD,
          name: TEST_NAME,
        },
      });

      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body).toHaveProperty('error');
    });

    test('should return 400 when validation fails - password too short', async ({ request }) => {
      const response = await request.post(`${API_URL}/register`, {
        data: {
          email: uniqueEmail('reg-short-pw'),
          password: '123',
          name: TEST_NAME,
        },
      });

      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body).toHaveProperty('error');
    });

    test('should return 400 when validation fails - password missing complexity', async ({ request }) => {
      const response = await request.post(`${API_URL}/register`, {
        data: {
          email: uniqueEmail('reg-weak-pw'),
          password: 'password123', // Missing uppercase and special character
          name: TEST_NAME,
        },
      });

      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body).toHaveProperty('error');
    });

    test('should return 400 when required fields are missing', async ({ request }) => {
      const response = await request.post(`${API_URL}/register`, {
        data: {
          email: uniqueEmail('reg-missing'),
          // Missing password and name
        },
      });

      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body).toHaveProperty('error');
    });
  });

  test.describe('POST /api/auth/login', () => {
    test('should login user successfully', async ({ request }) => {
      const email = uniqueEmail('login-success');

      // First register a user
      const registerResponse = await registerUser(request, email);
      expect(registerResponse.status()).toBe(201);

      // Then login
      const loginResponse = await request.post(`${API_URL}/login`, {
        data: { email, password: TEST_PASSWORD },
      });

      expect(loginResponse.status()).toBe(200);
      const body = await loginResponse.json();
      expect(body).toHaveProperty('user');
      expect(body).toHaveProperty('accessToken');
      expect(body.user).toHaveProperty('email', email);
      expect(body.user).not.toHaveProperty('password');
      expect(typeof body.accessToken).toBe('string');
      expect(body.accessToken.length).toBeGreaterThan(0);
    });

    test('should return 401 with invalid credentials', async ({ request }) => {
      const email = uniqueEmail('login-wrong-pw');
      await registerUser(request, email);

      // Try to login with wrong password
      const response = await request.post(`${API_URL}/login`, {
        data: { email, password: 'WrongPassword123!' },
      });

      expect(response.status()).toBe(401);
      const body = await response.json();
      expect(body).toHaveProperty('error');
      expect(body.message).toContain('Invalid email or password');
    });

    test('should return 401 with non-existent email', async ({ request }) => {
      const response = await request.post(`${API_URL}/login`, {
        data: {
          email: 'nonexistent@example.com',
          password: TEST_PASSWORD,
        },
      });

      expect(response.status()).toBe(401);
      const body = await response.json();
      expect(body).toHaveProperty('error');
      expect(body.message).toContain('Invalid email or password');
    });

    test('should return 400 when validation fails', async ({ request }) => {
      const response = await request.post(`${API_URL}/login`, {
        data: {
          email: 'invalid-email',
          password: '123', // Too short
        },
      });

      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body).toHaveProperty('error');
    });
  });

  test.describe('GET /api/auth/me', () => {
    test('should return current user with valid token', async ({ request }) => {
      const email = uniqueEmail('me-valid');

      // Register and get token
      const registerResponse = await registerUser(request, email);
      expect(registerResponse.status()).toBe(201);
      const { accessToken } = await registerResponse.json();

      // Get current user
      const meResponse = await request.get(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      expect(meResponse.status()).toBe(200);
      const body = await meResponse.json();
      expect(body).toHaveProperty('user');
      expect(body.user).toHaveProperty('email', email);
      expect(body.user).toHaveProperty('name', TEST_NAME);
      expect(body.user).not.toHaveProperty('password');
    });

    test('should return 401 without token', async ({ request }) => {
      const response = await request.get(`${API_URL}/me`);

      expect(response.status()).toBe(401);
      const body = await response.json();
      expect(body).toHaveProperty('error');
    });

    test('should return 401 with invalid token', async ({ request }) => {
      const response = await request.get(`${API_URL}/me`, {
        headers: { Authorization: 'Bearer invalid-token' },
      });

      expect(response.status()).toBe(401);
      const body = await response.json();
      expect(body).toHaveProperty('error');
    });

    test('should return 401 with malformed authorization header', async ({ request }) => {
      const response = await request.get(`${API_URL}/me`, {
        headers: { Authorization: 'InvalidFormat token' },
      });

      expect(response.status()).toBe(401);
      const body = await response.json();
      expect(body).toHaveProperty('error');
    });
  });

  test.describe('POST /api/auth/logout', () => {
    test('should return success message', async ({ request }) => {
      const response = await request.post(`${API_URL}/logout`);

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body).toHaveProperty('message');
      expect(body.message).toContain('Logged out');
    });
  });

  test.describe('Protected Routes - Admin Access', () => {
    test('should return 401 when accessing protected route without token', async ({ request }) => {
      const response = await request.post(`${SERVER_URL}/api/projects`, {
        data: {
          title: 'Test Project',
          description: 'Test',
          location: 'Test',
          client: 'Test',
          constructionArea: 100,
          categoryIds: [],
          images: [],
        },
      });

      expect(response.status()).toBe(401);
      const body = await response.json();
      expect(body).toHaveProperty('error');
    });

    test('should return 403 when accessing admin route with non-admin token', async ({ request }) => {
      const email = uniqueEmail('admin-403');

      // Register a regular user
      const registerResponse = await registerUser(request, email);
      expect(registerResponse.status()).toBe(201);
      const { accessToken } = await registerResponse.json();

      // Try to access admin route
      const response = await request.post(`${SERVER_URL}/api/projects`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        data: {
          title: 'Test Project',
          description: 'Test',
          location: 'Test',
          client: 'Test',
          constructionArea: 100,
          categoryIds: [],
          images: [],
        },
      });

      expect(response.status()).toBe(403);
      const body = await response.json();
      expect(body).toHaveProperty('error');
      expect(body.message).toContain('Admin access required');
    });
  });
});
