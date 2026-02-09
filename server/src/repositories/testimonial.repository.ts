import { prisma } from '../config/database';
import {
  TestimonialRequest,
  TestimonialFilters,
} from '../types/testimonial.types';

export const testimonialRepository = {
  async create(data: TestimonialRequest) {
    return prisma.testimonial.create({ data });
  },

  async findAll(filters?: TestimonialFilters) {
    return prisma.testimonial.findMany({
      where:
        filters?.isPublished !== undefined
          ? { isPublished: filters.isPublished }
          : {},
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
  },

  async findById(id: string) {
    return prisma.testimonial.findUnique({ where: { id } });
  },

  async update(id: string, data: Partial<TestimonialRequest>) {
    return prisma.testimonial.update({ where: { id }, data });
  },

  async delete(id: string) {
    return prisma.testimonial.delete({ where: { id } });
  },

  async updateOrder(id: string, order: number) {
    return prisma.testimonial.update({ where: { id }, data: { order } });
  },
};
