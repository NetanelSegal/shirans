import { Request, Response } from 'express';
import { calculatorService } from '../services/calculator.service';
import {
  submitCalculatorLeadSchema,
  calculatorConfigSchema,
  calculatorLeadIdSchema,
  calculatorLeadsQuerySchema,
  calculatorUpdateReadSchema,
} from '@shirans/shared';
import { validateRequest } from '../utils/validation';
import { HTTP_STATUS } from '../constants/httpStatus';

/**
 * Submit a calculator lead (admin only - calculator is admin-only)
 * POST /api/calculator/leads
 */
export async function submitLead(req: Request, res: Response): Promise<Response> {
  const validatedData = validateRequest(submitCalculatorLeadSchema, req.body);
  const lead = await calculatorService.submitLead(validatedData);
  return res.status(HTTP_STATUS.CREATED).json(lead);
}

/**
 * Get all calculator leads (admin only)
 * GET /api/calculator/leads?isRead=true
 */
export async function getAllLeads(req: Request, res: Response): Promise<Response> {
  const { isRead } = validateRequest(calculatorLeadsQuerySchema, req.query);
  const leads = await calculatorService.getLeads(isRead !== undefined ? { isRead } : undefined);
  return res.status(HTTP_STATUS.OK).json(leads);
}

/**
 * Get a calculator lead by ID (admin only)
 * GET /api/calculator/leads/:id
 */
export async function getLeadById(req: Request, res: Response): Promise<Response> {
  const { id } = validateRequest(calculatorLeadIdSchema, req.params);
  const lead = await calculatorService.getLeadById(id);
  return res.status(HTTP_STATUS.OK).json(lead);
}

/**
 * Update read status (admin only)
 * PATCH /api/calculator/leads/:id/read
 */
export async function updateLeadReadStatus(
  req: Request,
  res: Response
): Promise<Response> {
  const { id } = validateRequest(calculatorLeadIdSchema, req.params);
  const { isRead } = validateRequest(calculatorUpdateReadSchema, req.body);
  const lead = await calculatorService.updateLeadReadStatus(id, isRead);
  return res.status(HTTP_STATUS.OK).json(lead);
}

/**
 * Delete a calculator lead (admin only)
 * DELETE /api/calculator/leads/:id
 */
export async function deleteLead(req: Request, res: Response): Promise<Response> {
  const { id } = validateRequest(calculatorLeadIdSchema, req.params);
  await calculatorService.deleteLead(id);
  return res.status(HTTP_STATUS.OK).json({ message: 'Lead deleted successfully' });
}

/**
 * Get calculator config (admin only - for editing)
 * GET /api/calculator/config
 */
export async function getConfig(_req: Request, res: Response): Promise<Response> {
  const config = await calculatorService.getConfig();
  return res.status(HTTP_STATUS.OK).json(config);
}

/**
 * Update calculator config (admin only)
 * PUT /api/calculator/config
 */
export async function updateConfig(req: Request, res: Response): Promise<Response> {
  const validatedData = validateRequest(calculatorConfigSchema, req.body);
  const config = await calculatorService.updateConfig(validatedData);
  return res.status(HTTP_STATUS.OK).json(config);
}
