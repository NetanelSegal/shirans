import { prisma } from '../config/database';
import type { ContactRequest, ContactResponse } from '../types/contact.types';

/**
 * Contact Repository
 * Handles all database access for ContactSubmissions using Prisma ORM
 */
export const contactRepository = {
  /**
   * Create a new contact submission
   * @param data - Contact submission data
   * @returns Created contact submission
   */
  async create(data: ContactRequest): Promise<ContactResponse> {
    return await prisma.contactSubmission.create({
      data: {
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        message: data.message || null,
      },
    });
  },

  /**
   * Find all contact submissions
   * @param filters - Optional filters for isRead status
   * @returns Array of contact submissions ordered by creation date (newest first)
   */
  async findAll(filters?: { isRead?: boolean }): Promise<ContactResponse[]> {
    const where: { isRead?: boolean } = {};
    if (filters?.isRead !== undefined) {
      where.isRead = filters.isRead;
    }

    return await prisma.contactSubmission.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  },

  /**
   * Find a contact submission by ID
   * @param id - Contact submission ID
   * @returns Contact submission or null if not found
   */
  async findById(id: string): Promise<ContactResponse | null> {
    return await prisma.contactSubmission.findUnique({
      where: { id },
    });
  },

  /**
   * Update read status of a contact submission
   * @param id - Contact submission ID
   * @param isRead - Read status
   * @returns Updated contact submission
   */
  async updateReadStatus(id: string, isRead: boolean): Promise<ContactResponse> {
    return await prisma.contactSubmission.update({
      where: { id },
      data: { isRead },
    });
  },

  /**
   * Delete a contact submission
   * @param id - Contact submission ID
   */
  async delete(id: string): Promise<void> {
    await prisma.contactSubmission.delete({
      where: { id },
    });
  },
};
