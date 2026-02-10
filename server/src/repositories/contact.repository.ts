import { prisma } from '../config/database';
import type { ContactResponse, CreateContactInput } from '@shirans/shared';

function transformContact(contact: {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  message: string | null;
  isRead: boolean;
  createdAt: Date;
}): ContactResponse {
  return {
    id: contact.id,
    name: contact.name,
    email: contact.email,
    phoneNumber: contact.phoneNumber,
    message: contact.message,
    isRead: contact.isRead,
    createdAt: contact.createdAt.toISOString(),
  };
}

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
  async create(data: CreateContactInput): Promise<ContactResponse> {
    const contact = await prisma.contactSubmission.create({
      data: {
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        message: data.message || null,
      },
    });
    return transformContact(contact);
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

    const contacts = await prisma.contactSubmission.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    return contacts.map(transformContact);
  },

  /**
   * Find a contact submission by ID
   * @param id - Contact submission ID
   * @returns Contact submission or null if not found
   */
  async findById(id: string): Promise<ContactResponse | null> {
    const contact = await prisma.contactSubmission.findUnique({
      where: { id },
    });
    return contact ? transformContact(contact) : null;
  },

  /**
   * Update read status of a contact submission
   * @param id - Contact submission ID
   * @param isRead - Read status
   * @returns Updated contact submission
   */
  async updateReadStatus(id: string, isRead: boolean): Promise<ContactResponse> {
    const contact = await prisma.contactSubmission.update({
      where: { id },
      data: { isRead },
    });
    return transformContact(contact);
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
