import apiClient from '@/utils/apiClient';
import { urls } from '@/constants/urls';
import type {
  CostCalculatorConfig,
  CostCalculatorLeadResponse,
  SubmitCostCalculatorLeadInput,
} from '@shirans/shared';

export const calculatorService = {
  /**
   * Note there is no estimate in the payload. The server recomputes it from the
   * stored rates, so what the wizard shows and what the lead records can only
   * differ if the config changed between the two — not because the number took
   * a detour through the browser.
   */
  async submitLead(
    data: SubmitCostCalculatorLeadInput,
  ): Promise<CostCalculatorLeadResponse> {
    const { data: lead } = await apiClient.post<CostCalculatorLeadResponse>(
      urls.calculator.leads,
      data,
    );
    return lead;
  },

  async getLeads(filters?: {
    isRead?: boolean;
  }): Promise<CostCalculatorLeadResponse[]> {
    const params = new URLSearchParams();
    if (filters?.isRead !== undefined) params.set('isRead', String(filters.isRead));
    const { data } = await apiClient.get<CostCalculatorLeadResponse[]>(
      `${urls.calculator.leads}?${params.toString()}`,
    );
    return data;
  },

  async getLeadById(id: string): Promise<CostCalculatorLeadResponse> {
    const { data } = await apiClient.get<CostCalculatorLeadResponse>(
      urls.calculator.leadById(id),
    );
    return data;
  },

  async updateLeadRead(
    id: string,
    isRead: boolean,
  ): Promise<CostCalculatorLeadResponse> {
    const { data } = await apiClient.patch<CostCalculatorLeadResponse>(
      urls.calculator.leadRead(id),
      { isRead },
    );
    return data;
  },

  async deleteLead(id: string): Promise<void> {
    await apiClient.delete(urls.calculator.leadById(id));
  },

  async updateLeadReadBulk(
    ids: string[],
    isRead: boolean,
  ): Promise<{ count: number }> {
    const { data } = await apiClient.patch<{ count: number }>(
      urls.calculator.leadsBulkRead,
      { ids, isRead },
    );
    return data;
  },

  async deleteLeadsBulk(ids: string[]): Promise<{ count: number }> {
    const { data } = await apiClient.delete<{ count: number }>(
      urls.calculator.leadsBulkDelete,
      { data: { ids } },
    );
    return data;
  },

  async getConfig(): Promise<CostCalculatorConfig | null> {
    const { data } = await apiClient.get<CostCalculatorConfig | null>(
      urls.calculator.config,
    );
    return data;
  },

  async updateConfig(config: CostCalculatorConfig): Promise<CostCalculatorConfig> {
    const { data } = await apiClient.put<CostCalculatorConfig>(
      urls.calculator.config,
      config,
    );
    return data;
  },
};
