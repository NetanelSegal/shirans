import { Request, Response } from 'express';
import { testimonialService } from '../services/testimonial.service';
import { validateRequest } from '../utils/validation';
import {
  createTestimonialSchema,
  testimonialIdSchema,
  testimonialQuerySchema,
} from '../validators/testimonial.validators';
import { HTTP_STATUS } from '../constants/httpStatus';
import z from 'zod';

export const createTestimonial = async (req: Request, res: Response) => {
  const data = validateRequest(createTestimonialSchema, req.body);
  const testimonial = await testimonialService.createTestimonial(data);
  res.status(HTTP_STATUS.CREATED).json(testimonial);
};

export const getAllTestimonials = async (req: Request, res: Response) => {
  const query = validateRequest(testimonialQuerySchema, req.query);
  const isPublished =
    query.isPublished === 'true'
      ? true
      : query.isPublished === 'false'
        ? false
        : undefined;
  const testimonials = await testimonialService.getAllTestimonials({
    isPublished,
  });
  res.status(HTTP_STATUS.OK).json(testimonials);
};

export const getPublishedTestimonials = async (req: Request, res: Response) => {
  const testimonials = await testimonialService.getPublishedTestimonials();
  res.status(HTTP_STATUS.OK).json(testimonials);
};

export const getTestimonialById = async (req: Request, res: Response) => {
  const { id } = validateRequest(testimonialIdSchema, req.params);
  const testimonial = await testimonialService.getTestimonialById(id);
  res.status(HTTP_STATUS.OK).json(testimonial);
};

export const updateTestimonial = async (req: Request, res: Response) => {
  const { id } = validateRequest(testimonialIdSchema, req.params);
  const data = validateRequest(createTestimonialSchema.partial(), req.body); // Use partial for update
  const testimonial = await testimonialService.updateTestimonial(id, data);
  res.status(HTTP_STATUS.OK).json(testimonial);
};

export const deleteTestimonial = async (req: Request, res: Response) => {
  const { id } = validateRequest(testimonialIdSchema, req.params);
  await testimonialService.deleteTestimonial(id);
  res
    .status(HTTP_STATUS.OK)
    .json({ message: 'Testimonial deleted successfully' });
};

export const updateTestimonialOrder = async (req: Request, res: Response) => {
  const { id } = validateRequest(testimonialIdSchema, req.params);
  const { order } = validateRequest(z.object({ order: z.number() }), req.body); // Validate order from body
  const testimonial = await testimonialService.updateTestimonialOrder(
    id,
    order,
  );
  res.status(HTTP_STATUS.OK).json(testimonial);
};
