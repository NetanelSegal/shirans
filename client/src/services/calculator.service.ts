import apiClient from '@/utils/apiClient';
import { urls } from '@/constants/urls';
import type {
  CalculatorFormInput,
  SubmitCalculatorLeadInput,
  CalculatorConfigInput,
  CalculatorLeadResponse,
} from '@shirans/shared';

export const calculatorService = {
  async submitLead(data: SubmitCalculatorLeadInput): Promise<CalculatorLeadResponse> {
    const { data: lead } = await apiClient.post<CalculatorLeadResponse>(
      urls.calculator.leads,
      data
    );
    return lead;
  },

  async submitLeadFromForm(
    data: CalculatorFormInput,
    estimate: number
  ): Promise<CalculatorLeadResponse> {
    return this.submitLead({ ...data, priceDisplay: 'before_vat', estimate });
  },

  async getLeads(filters?: { isRead?: boolean }): Promise<CalculatorLeadResponse[]> {
    const params = new URLSearchParams();
    if (filters?.isRead !== undefined) {
      params.set('isRead', String(filters.isRead));
    }
    const { data } = await apiClient.get<CalculatorLeadResponse[]>(
      `${urls.calculator.leads}?${params.toString()}`
    );
    return data;
  },

  async getLeadById(id: string): Promise<CalculatorLeadResponse> {
    const { data } = await apiClient.get<CalculatorLeadResponse>(
      urls.calculator.leadById(id)
    );
    return data;
  },

  async updateLeadRead(id: string, isRead: boolean): Promise<CalculatorLeadResponse> {
    const { data } = await apiClient.patch<CalculatorLeadResponse>(
      urls.calculator.leadRead(id),
      { isRead }
    );
    return data;
  },

  async deleteLead(id: string): Promise<void> {
    await apiClient.delete(urls.calculator.leadById(id));
  },

  async updateLeadReadBulk(ids: string[], isRead: boolean): Promise<{ count: number }> {
    const { data } = await apiClient.patch<{ count: number }>(
      urls.calculator.leadsBulkRead,
      { ids, isRead }
    );
    return data;
  },

  async deleteLeadsBulk(ids: string[]): Promise<{ count: number }> {
    const { data } = await apiClient.delete<{ count: number }>(
      urls.calculator.leadsBulkDelete,
      { data: { ids } }
    );
    return data;
  },

  async getConfig(): Promise<CalculatorConfigInput | null> {
    const { data } = await apiClient.get<CalculatorConfigInput | null>(
      urls.calculator.config
    );
    return data;
  },

  async updateConfig(config: CalculatorConfigInput): Promise<CalculatorConfigInput> {
    const { data } = await apiClient.put<CalculatorConfigInput>(
      urls.calculator.config,
      config
    );
    return data;
  },
};
