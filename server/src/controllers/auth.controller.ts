import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { registerSchema, loginSchema } from '../validators/auth.validators';
import { validateRequest } from '../utils/validation';

/**
 * Register a new user
 * POST /api/auth/register
 * Body: { email, password, name }
 */
export async function register(
  req: Request,
  res: Response
): Promise<Response> {
  const validatedData = validateRequest(registerSchema, req.body);
  const result = await authService.register(validatedData);
  return res.status(201).json(result);
}

/**
 * Login user
 * POST /api/auth/login
 * Body: { email, password }
 */
export async function login(
  req: Request,
  res: Response
): Promise<Response> {
  const validatedData = validateRequest(loginSchema, req.body);
  const result = await authService.login(validatedData);
  return res.status(200).json(result);
}

/**
 * Get current authenticated user
 * GET /api/auth/me
 * Requires: Authentication (Bearer token)
 */
export async function getCurrentUser(
  req: Request,
  res: Response
): Promise<Response> {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
  }

  const user = await authService.getCurrentUser(req.user.userId);
  return res.status(200).json({ user });
}

/**
 * Logout user (client-side token removal)
 * POST /api/auth/logout
 */
export function logout(
  _req: Request,
  res: Response
): Response {
  // Logout is handled client-side by removing the token
  // This endpoint just confirms the logout
  return res.status(200).json({ message: 'Logged out successfully' });
}
