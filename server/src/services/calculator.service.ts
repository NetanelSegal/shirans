import { Prisma } from '@prisma/client';
import { calculatorRepository } from '../repositories/calculator.repository';
import type {
  SubmitCalculatorLeadInput,
  CalculatorConfigInput,
} from '@shirans/shared';
import { HTTP_STATUS } from '@shirans/shared';
import { HttpError } from '../middleware/errorHandler';
import { getServerErrorMessage } from '../constants/errorMessages';
import logger from '../middleware/logger';

export const calculatorService = {
  async submitLead(data: SubmitCalculatorLeadInput) {
    return calculatorRepository.createLead(data);
  },

  async getLeads(filters?: { isRead?: boolean }) {
    return calculatorRepository.findAllLeads(filters);
  },

  async getLeadById(id: string) {
    const lead = await calculatorRepository.findLeadById(id);
    if (!lead) {
      throw new HttpError(
        HTTP_STATUS.NOT_FOUND,
        getServerErrorMessage('NOT_FOUND.RESOURCE_NOT_FOUND'),
      );
    }
    return lead;
  },

  async updateLeadReadStatus(id: string, isRead: boolean) {
    try {
      await calculatorService.getLeadById(id); // throws if not found
      return calculatorRepository.updateLeadReadStatus(id, isRead);
    } catch (error) {
      if (error instanceof HttpError) throw error;
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new HttpError(
          HTTP_STATUS.NOT_FOUND,
          getServerErrorMessage('NOT_FOUND.RESOURCE_NOT_FOUND'),
        );
      }
      logger.error('Error updating calculator lead read status', { error, id });
      throw new HttpError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        getServerErrorMessage('SERVER.CALCULATOR.UPDATE_LEAD_FAILED'),
      );
    }
  },

  async deleteLead(id: string) {
    try {
      await calculatorService.getLeadById(id); // throws if not found
      return calculatorRepository.deleteLead(id);
    } catch (error) {
      if (error instanceof HttpError) throw error;
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new HttpError(
          HTTP_STATUS.NOT_FOUND,
          getServerErrorMessage('NOT_FOUND.RESOURCE_NOT_FOUND'),
        );
      }
      logger.error('Error deleting calculator lead', { error, id });
      throw new HttpError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        getServerErrorMessage('SERVER.CALCULATOR.DELETE_LEAD_FAILED'),
      );
    }
  },

  async getConfig(): Promise<CalculatorConfigInput | null> {
    return calculatorRepository.getConfig();
  },

  async updateConfig(config: CalculatorConfigInput) {
    return calculatorRepository.upsertConfig(config);
  },
};
