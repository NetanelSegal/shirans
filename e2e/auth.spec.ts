import { test, expect } from '@playwright/test';

const API_BASE_URL = process.env.PLAYWRIGHT_BASE_URL?.replace(':5174', ':3000') || 'http://localhost:3000';
const API_URL = `${API_BASE_URL}/api/auth`;

test.describe('Authentication Flow', () => {
  // Test user credentials
  const testUser = {
    email: `test-${Date.now()}@example.com`,
    password: 'Password123!',
    name: 'Test User',
  };

  test.describe('POST /api/auth/register', () => {
    test('should register a new user successfully', async ({ request }) => {
      const response = await request.post(`${API_URL}/register`, {
        data: {
          email: testUser.email,
          password: testUser.password,
          name: testUser.name,
        },
      });

      expect(response.status()).toBe(201);
      const body = await response.json();
      expect(body).toHaveProperty('user');
      expect(body).toHaveProperty('token');
      expect(body.user).toHaveProperty('email', testUser.email);
      expect(body.user).toHaveProperty('name', testUser.name);
      expect(body.user).toHaveProperty('role');
      expect(body.user).not.toHaveProperty('password');
      expect(typeof body.token).toBe('string');
      expect(body.token.length).toBeGreaterThan(0);
    });

    test('should return 409 when email already exists', async ({ request }) => {
      // First registration
      await request.post(`${API_URL}/register`, {
        data: {
          email: testUser.email,
          password: testUser.password,
          name: testUser.name,
        },
      });

      // Try to register again with same email
      const response = await request.post(`${API_URL}/register`, {
        data: {
          email: testUser.email,
          password: testUser.password,
          name: testUser.name,
        },
      });

      expect(response.status()).toBe(409);
      const body = await response.json();
      expect(body).toHaveProperty('error');
      expect(body.message).toContain('already registered');
    });

    test('should return 400 when validation fails - invalid email', async ({ request }) => {
      const response = await request.post(`${API_URL}/register`, {
        data: {
          email: 'invalid-email',
          password: testUser.password,
          name: testUser.name,
        },
      });

      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body).toHaveProperty('error');
    });

    test('should return 400 when validation fails - password too short', async ({ request }) => {
      const response = await request.post(`${API_URL}/register`, {
        data: {
          email: `test-${Date.now()}@example.com`,
          password: '123',
          name: testUser.name,
        },
      });

      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body).toHaveProperty('error');
    });

    test('should return 400 when validation fails - password missing complexity', async ({ request }) => {
      const response = await request.post(`${API_URL}/register`, {
        data: {
          email: `test-${Date.now()}@example.com`,
          password: 'password123', // Missing uppercase and special character
          name: testUser.name,
        },
      });

      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body).toHaveProperty('error');
    });

    test('should return 400 when required fields are missing', async ({ request }) => {
      const response = await request.post(`${API_URL}/register`, {
        data: {
          email: testUser.email,
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
      // First register a user
      const registerResponse = await request.post(`${API_URL}/register`, {
        data: {
          email: testUser.email,
          password: testUser.password,
          name: testUser.name,
        },
      });
      expect(registerResponse.status()).toBe(201);

      // Then login
      const loginResponse = await request.post(`${API_URL}/login`, {
        data: {
          email: testUser.email,
          password: testUser.password,
        },
      });

      expect(loginResponse.status()).toBe(200);
      const body = await loginResponse.json();
      expect(body).toHaveProperty('user');
      expect(body).toHaveProperty('token');
      expect(body.user).toHaveProperty('email', testUser.email);
      expect(body.user).not.toHaveProperty('password');
      expect(typeof body.token).toBe('string');
      expect(body.token.length).toBeGreaterThan(0);
    });

    test('should return 401 with invalid credentials', async ({ request }) => {
      // First register a user
      await request.post(`${API_URL}/register`, {
        data: {
          email: testUser.email,
          password: testUser.password,
          name: testUser.name,
        },
      });

      // Try to login with wrong password
      const response = await request.post(`${API_URL}/login`, {
        data: {
          email: testUser.email,
          password: 'WrongPassword123!',
        },
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
          password: testUser.password,
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
      // Register and get token
      const registerResponse = await request.post(`${API_URL}/register`, {
        data: {
          email: testUser.email,
          password: testUser.password,
          name: testUser.name,
        },
      });
      const { token } = await registerResponse.json();

      // Get current user
      const meResponse = await request.get(`${API_URL}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      expect(meResponse.status()).toBe(200);
      const body = await meResponse.json();
      expect(body).toHaveProperty('user');
      expect(body.user).toHaveProperty('email', testUser.email);
      expect(body.user).toHaveProperty('name', testUser.name);
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
        headers: {
          Authorization: 'Bearer invalid-token',
        },
      });

      expect(response.status()).toBe(401);
      const body = await response.json();
      expect(body).toHaveProperty('error');
    });

    test('should return 401 with malformed authorization header', async ({ request }) => {
      const response = await request.get(`${API_URL}/me`, {
        headers: {
          Authorization: 'InvalidFormat token',
        },
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
      const response = await request.post(`${API_BASE_URL}/api/projects`, {
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
      // Register a regular user
      const registerResponse = await request.post(`${API_URL}/register`, {
        data: {
          email: testUser.email,
          password: testUser.password,
          name: testUser.name,
        },
      });
      const { token } = await registerResponse.json();

      // Try to access admin route
      const response = await request.post(`${API_BASE_URL}/api/projects`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
