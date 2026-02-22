import { Request, Response } from 'express';
import { userService } from '../services/user.service';

/**
 * Get all users (admin only)
 * GET /api/users
 */
export async function getAllUsers(
  _req: Request,
  res: Response
): Promise<Response> {
  const users = await userService.getAllUsers();
  return res.status(200).json(users);
}
