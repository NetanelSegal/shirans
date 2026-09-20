import { Prisma } from '@prisma/client';
import { calculatorRepository } from '../repositories/calculator.repository';
import {
  calculateCostRange,
  costCalculatorAnswersSchema,
  HTTP_STATUS,
} from '@shirans/shared';
import type {
  CostCalculatorConfig,
  CostCalculatorLeadResponse,
  SubmitCostCalculatorLeadInput,
} from '@shirans/shared';
import { HttpError } from '../middleware/errorHandler';
import { getServerErrorMessage } from '../constants/errorMessages';
import logger from '../middleware/logger';

/** Maps Prisma's "record not found" onto a 404 instead of a 500. */
function isMissingRecord(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025'
  );
}

export const calculatorService = {
  /**
   * The estimate is computed here, never accepted from the request. The client
   * calculates the same number to show it live in the wizard, but what gets
   * stored has to come from the rates Shiran actually set — otherwise the lead
   * records whatever the browser felt like sending.
   */
  async submitLead(
    data: SubmitCostCalculatorLeadInput,
  ): Promise<CostCalculatorLeadResponse> {
    try {
      const config = await calculatorRepository.getConfig();
      const { min, max } = config.builtAreaSqmRange;

      if (data.builtAreaSqm < min || data.builtAreaSqm > max) {
        throw new HttpError(
          HTTP_STATUS.BAD_REQUEST,
          getServerErrorMessage('VALIDATION.BUILT_AREA_OUT_OF_RANGE'),
        );
      }

      const answers = costCalculatorAnswersSchema.parse(data);
      const estimate = calculateCostRange(answers, config);

      return await calculatorRepository.createLead(data, estimate);
    } catch (error) {
      if (error instanceof HttpError) throw error;
      logger.error('Error submitting cost calculator lead', { error });
      throw new HttpError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        getServerErrorMessage('SERVER.CALCULATOR.SUBMIT_FAILED'),
      );
    }
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
      return await calculatorRepository.updateLeadReadStatus(id, isRead);
    } catch (error) {
      if (error instanceof HttpError) throw error;
      if (isMissingRecord(error)) {
        throw new HttpError(
          HTTP_STATUS.NOT_FOUND,
          getServerErrorMessage('NOT_FOUND.RESOURCE_NOT_FOUND'),
        );
      }
      logger.error('Error updating cost calculator lead read status', { error, id });
      throw new HttpError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        getServerErrorMessage('SERVER.CALCULATOR.UPDATE_LEAD_FAILED'),
      );
    }
  },

  async deleteLead(id: string) {
    try {
      await calculatorService.getLeadById(id); // throws if not found
      return await calculatorRepository.deleteLead(id);
    } catch (error) {
      if (error instanceof HttpError) throw error;
      if (isMissingRecord(error)) {
        throw new HttpError(
          HTTP_STATUS.NOT_FOUND,
          getServerErrorMessage('NOT_FOUND.RESOURCE_NOT_FOUND'),
        );
      }
      logger.error('Error deleting cost calculator lead', { error, id });
      throw new HttpError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        getServerErrorMessage('SERVER.CALCULATOR.DELETE_LEAD_FAILED'),
      );
    }
  },

  async updateLeadReadStatusBulk(
    ids: string[],
    isRead: boolean,
  ): Promise<{ count: number }> {
    try {
      return { count: await calculatorRepository.updateLeadReadStatusBulk(ids, isRead) };
    } catch (error) {
      logger.error('Error bulk updating cost calculator lead read status', {
        error,
        ids,
      });
      throw new HttpError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        getServerErrorMessage('SERVER.CALCULATOR.UPDATE_LEAD_FAILED'),
      );
    }
  },

  async deleteLeadsBulk(ids: string[]): Promise<{ count: number }> {
    try {
      return { count: await calculatorRepository.deleteLeadsBulk(ids) };
    } catch (error) {
      logger.error('Error bulk deleting cost calculator leads', { error, ids });
      throw new HttpError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        getServerErrorMessage('SERVER.CALCULATOR.DELETE_LEAD_FAILED'),
      );
    }
  },

  async getConfig(): Promise<CostCalculatorConfig> {
    return calculatorRepository.getConfig();
  },

  async updateConfig(config: CostCalculatorConfig): Promise<CostCalculatorConfig> {
    return calculatorRepository.upsertConfig(config);
  },
};
