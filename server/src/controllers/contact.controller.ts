import { Request, Response } from 'express';
import { contactService } from '../services/contact.service';
import {
  createContactSchema,
  contactIdSchema,
  updateReadStatusSchema,
} from '../validators/contact.validators';
import { validateRequest } from '../utils/validation';

/**
 * Submit a contact form (public)
 * POST /api/contact
 * Body: ContactRequest
 */
export async function submitContact(
  req: Request,
  res: Response
): Promise<Response> {
  const validatedData = validateRequest(createContactSchema, req.body);
  const submission = await contactService.submitContact(validatedData);
  return res.status(201).json(submission);
}

/**
 * Get all contact submissions (admin only - future auth)
 * GET /api/contact?isRead=true
 */
export async function getAllSubmissions(
  req: Request,
  res: Response
): Promise<Response> {
  const filters: { isRead?: boolean } = {};
  if (req.query.isRead !== undefined) {
    filters.isRead = req.query.isRead === 'true';
  }
  const submissions = await contactService.getSubmissions(filters);
  return res.status(200).json(submissions);
}

/**
 * Get a contact submission by ID (admin only - future auth)
 * GET /api/contact/:id
 */
export async function getSubmissionById(
  req: Request,
  res: Response
): Promise<Response> {
  const { id } = validateRequest(contactIdSchema, req.params);
  const submission = await contactService.getSubmissionById(id);
  return res.status(200).json(submission);
}

/**
 * Update read status of a contact submission (admin only - future auth)
 * PATCH /api/contact/:id/read
 * Body: { isRead: boolean }
 */
export async function updateReadStatus(
  req: Request,
  res: Response
): Promise<Response> {
  const { id } = validateRequest(contactIdSchema, req.params);
  const { isRead } = validateRequest(updateReadStatusSchema, req.body);
  const submission = await contactService.updateReadStatus(id, isRead);
  return res.status(200).json(submission);
}

/**
 * Delete a contact submission (admin only - future auth)
 * DELETE /api/contact/:id
 */
export async function deleteSubmission(
  req: Request,
  res: Response
): Promise<Response> {
  const { id } = validateRequest(contactIdSchema, req.params);
  await contactService.deleteSubmission(id);
  return res.status(200).json({ message: 'Contact submission deleted successfully' });
}
