import { contactRepository } from '../repositories/contact.repository';
import type { ContactRequest, ContactResponse } from '../types/contact.types';
import { HttpError } from '../middleware/errorHandler';
import { HTTP_STATUS } from '../constants/httpStatus';
import { ERROR_MESSAGES } from '../constants/errorMessages';
import { Prisma } from '../../prisma/generated/prisma/client';
import logger from '../middleware/logger';

/**
 * Contact Service
 * Business logic layer for contact submission operations
 */
export const contactService = {
  /**
   * Submit a contact form
   * @param data - Contact submission data
   * @returns Created contact submission
   */
  async submitContact(data: ContactRequest): Promise<ContactResponse> {
    try {
      return await contactRepository.create(data);
    } catch (error) {
      logger.error('Error submitting contact form', { error });
      throw new HttpError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        ERROR_MESSAGES.SERVER.SUBMIT_CONTACT_FAILED
      );
    }
  },

  /**
   * Get all contact submissions
   * @param filters - Optional filters for isRead status
   * @returns Array of contact submissions
   */
  async getSubmissions(filters?: { isRead?: boolean }): Promise<ContactResponse[]> {
    try {
      return await contactRepository.findAll(filters);
    } catch (error) {
      logger.error('Error fetching contact submissions', { error });
      throw new HttpError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        'Failed to fetch contact submissions'
      );
    }
  },

  /**
   * Get a contact submission by ID
   * @param id - Contact submission ID
   * @returns Contact submission
   * @throws HttpError 404 if not found
   */
  async getSubmissionById(id: string): Promise<ContactResponse> {
    try {
      const submission = await contactRepository.findById(id);
      if (!submission) {
        throw new HttpError(
          HTTP_STATUS.NOT_FOUND,
          ERROR_MESSAGES.NOT_FOUND.RESOURCE_NOT_FOUND
        );
      }
      return submission;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      logger.error('Error fetching contact submission by ID', { error, id });
      throw new HttpError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        'Failed to fetch contact submission'
      );
    }
  },

  /**
   * Update read status of a contact submission
   * @param id - Contact submission ID
   * @param isRead - Read status
   * @returns Updated contact submission
   * @throws HttpError 404 if not found
   */
  async updateReadStatus(id: string, isRead: boolean): Promise<ContactResponse> {
    try {
      await this.getSubmissionById(id); // Throws if not found
      return await contactRepository.updateReadStatus(id, isRead);
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new HttpError(
            HTTP_STATUS.NOT_FOUND,
            ERROR_MESSAGES.NOT_FOUND.RESOURCE_NOT_FOUND
          );
        }
      }
      logger.error('Error updating contact submission read status', { error, id });
      throw new HttpError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        'Failed to update contact submission'
      );
    }
  },

  /**
   * Delete a contact submission
   * @param id - Contact submission ID
   * @throws HttpError 404 if not found
   */
  async deleteSubmission(id: string): Promise<void> {
    try {
      await this.getSubmissionById(id); // Throws if not found
      await contactRepository.delete(id);
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new HttpError(
            HTTP_STATUS.NOT_FOUND,
            ERROR_MESSAGES.NOT_FOUND.RESOURCE_NOT_FOUND
          );
        }
      }
      logger.error('Error deleting contact submission', { error, id });
      throw new HttpError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        'Failed to delete contact submission'
      );
    }
  },
};
