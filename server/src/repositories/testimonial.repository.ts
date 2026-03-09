import { prisma } from '../config/database';
import type { TestimonialResponse } from '@shirans/shared';
import {
  TestimonialRequest,
  TestimonialFilters,
} from '../types/testimonial.types';

function transformTestimonial(testimonial: {
  id: string;
  name: string;
  message: string;
  isPublished: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}): TestimonialResponse {
  return {
    id: testimonial.id,
    name: testimonial.name,
    message: testimonial.message,
    isPublished: testimonial.isPublished,
    order: testimonial.order,
    createdAt: testimonial.createdAt.toISOString(),
    updatedAt: testimonial.updatedAt.toISOString(),
  };
}

export const testimonialRepository = {
  async create(data: TestimonialRequest): Promise<TestimonialResponse> {
    const testimonial = await prisma.testimonial.create({ data });
    return transformTestimonial(testimonial);
  },

  async findAll(filters?: TestimonialFilters): Promise<TestimonialResponse[]> {
    const testimonials = await prisma.testimonial.findMany({
      where:
        filters?.isPublished !== undefined
          ? { isPublished: filters.isPublished }
          : {},
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
    return testimonials.map(transformTestimonial);
  },

  async findById(id: string): Promise<TestimonialResponse | null> {
    const testimonial = await prisma.testimonial.findUnique({ where: { id } });
    return testimonial ? transformTestimonial(testimonial) : null;
  },

  async update(id: string, data: Partial<TestimonialRequest>): Promise<TestimonialResponse> {
    const testimonial = await prisma.testimonial.update({ where: { id }, data });
    return transformTestimonial(testimonial);
  },

  async delete(id: string) {
    return await prisma.testimonial.delete({ where: { id } });
  },

  async updateOrder(id: string, order: number): Promise<TestimonialResponse> {
    const testimonial = await prisma.testimonial.update({ where: { id }, data: { order } });
    return transformTestimonial(testimonial);
  },

  async updateBulk(
    ids: string[],
    data: { isPublished?: boolean }
  ): Promise<number> {
    if (Object.keys(data).length === 0) return 0;
    const result = await prisma.testimonial.updateMany({
      where: { id: { in: ids } },
      data,
    });
    return result.count;
  },

  async deleteBulk(ids: string[]): Promise<number> {
    const result = await prisma.testimonial.deleteMany({
      where: { id: { in: ids } },
    });
    return result.count;
  },
};
