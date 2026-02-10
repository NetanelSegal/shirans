import { testimonialRepository } from '../repositories/testimonial.repository';
import {
  TestimonialRequest,
  TestimonialFilters,
} from '../types/testimonial.types';
import { HttpError } from '../middleware/errorHandler';
import { HTTP_STATUS } from '../constants/httpStatus';
import { getServerErrorMessage } from '@/constants/errorMessages';
import logger from '../middleware/logger';
import { Prisma } from '@prisma/client';

export const testimonialService = {
  async createTestimonial(data: TestimonialRequest) {
    try {
      return await testimonialRepository.create(data);
    } catch (error) {
      logger.error('Failed to create testimonial', { error });
      throw new HttpError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        getServerErrorMessage('SERVER.TESTIMONIAL.CREATE_FAILED'),
      );
    }
  },

  async getAllTestimonials(filters?: TestimonialFilters) {
    try {
      return await testimonialRepository.findAll(filters);
    } catch (error) {
      logger.error('Failed to fetch testimonials', { error });
      throw new HttpError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        getServerErrorMessage('SERVER.TESTIMONIAL.FETCHS_FAILED'),
      );
    }
  },

  async getPublishedTestimonials() {
    return this.getAllTestimonials({ isPublished: true });
  },

  async getTestimonialById(id: string) {
    const testimonial = await testimonialRepository.findById(id);
    if (!testimonial) {
      throw new HttpError(
        HTTP_STATUS.NOT_FOUND,
        getServerErrorMessage('NOT_FOUND.TESTIMONIAL_NOT_FOUND'),
      );
    }
    return testimonial;
  },

  async updateTestimonial(id: string, data: Partial<TestimonialRequest>) {
    try {
      const testimonial = await testimonialRepository.update(id, data);
      if (!testimonial) {
        throw new HttpError(
          HTTP_STATUS.NOT_FOUND,
          getServerErrorMessage('NOT_FOUND.TESTIMONIAL_NOT_FOUND'),
        );
      }
      return testimonial;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new HttpError(
          HTTP_STATUS.NOT_FOUND,
          getServerErrorMessage('NOT_FOUND.TESTIMONIAL_NOT_FOUND'),
        );
      }
      logger.error('Failed to update testimonial', { error });
      throw new HttpError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        getServerErrorMessage('SERVER.TESTIMONIAL.UPDATE_FAILED'),
      );
    }
  },

  async deleteTestimonial(id: string) {
    try {
      await testimonialRepository.delete(id);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new HttpError(
          HTTP_STATUS.NOT_FOUND,
          getServerErrorMessage('NOT_FOUND.TESTIMONIAL_NOT_FOUND'),
        );
      }
      logger.error('Failed to delete testimonial', { error });
      throw new HttpError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        getServerErrorMessage('SERVER.TESTIMONIAL.DELETE_FAILED'),
      );
    }
  },

  async updateTestimonialOrder(id: string, order: number) {
    try {
      const testimonial = await testimonialRepository.updateOrder(id, order);
      if (!testimonial) {
        throw new HttpError(
          HTTP_STATUS.NOT_FOUND,
          getServerErrorMessage('NOT_FOUND.TESTIMONIAL_NOT_FOUND'),
        );
      }
      return testimonial;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new HttpError(
          HTTP_STATUS.NOT_FOUND,
          getServerErrorMessage('NOT_FOUND.TESTIMONIAL_NOT_FOUND'),
        );
      }
      logger.error('Failed to update testimonial order', { error });
      throw new HttpError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        getServerErrorMessage('SERVER.TESTIMONIAL.UPDATE_ORDER_FAILED'),
      );
    }
  },
};
