import { prisma } from '../config/database';
import type {
  CalculatorLeadResponse,
  CalculatorConfigInput,
} from '@shirans/shared';
import type { SubmitCalculatorLeadInput } from '@shirans/shared';
import { DEFAULT_CALCULATOR_CONFIG } from '@shirans/shared';

function transformLead(lead: {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  builtAreaSqm: number;
  constructionFinish: string;
  pool: string;
  outdoorAreaSqm: number;
  outdoorFinish: string;
  kitchen: string;
  carpentry: string;
  furniture: string;
  equipment: string;
  priceDisplay: string;
  estimateMin: number;
  estimateMax: number;
  isRead: boolean;
  createdAt: Date;
}): CalculatorLeadResponse {
  return {
    id: lead.id,
    name: lead.name,
    email: lead.email,
    phoneNumber: lead.phoneNumber,
    builtAreaSqm: lead.builtAreaSqm,
    constructionFinish: lead.constructionFinish,
    pool: lead.pool,
    outdoorAreaSqm: lead.outdoorAreaSqm,
    outdoorFinish: lead.outdoorFinish,
    kitchen: lead.kitchen,
    carpentry: lead.carpentry,
    furniture: lead.furniture,
    equipment: lead.equipment,
    priceDisplay: lead.priceDisplay,
    estimateMin: lead.estimateMin,
    estimateMax: lead.estimateMax,
    isRead: lead.isRead,
    createdAt: lead.createdAt.toISOString(),
  };
}

export const calculatorRepository = {
  async createLead(data: SubmitCalculatorLeadInput): Promise<CalculatorLeadResponse> {
    const lead = await prisma.calculatorLead.create({
      data: {
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        builtAreaSqm: data.builtAreaSqm,
        constructionFinish: data.constructionFinish,
        pool: data.pool,
        outdoorAreaSqm: data.outdoorAreaSqm,
        outdoorFinish: data.outdoorFinish,
        kitchen: data.kitchen,
        carpentry: data.carpentry,
        furniture: data.furniture,
        equipment: data.equipment,
        priceDisplay: data.priceDisplay,
        estimateMin: data.estimate,
        estimateMax: data.estimate,
      },
    });
    return transformLead(lead);
  },

  async findAllLeads(filters?: { isRead?: boolean }): Promise<CalculatorLeadResponse[]> {
    const where: { isRead?: boolean } = {};
    if (filters?.isRead !== undefined) {
      where.isRead = filters.isRead;
    }
    const leads = await prisma.calculatorLead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    return leads.map(transformLead);
  },

  async findLeadById(id: string): Promise<CalculatorLeadResponse | null> {
    const lead = await prisma.calculatorLead.findUnique({
      where: { id },
    });
    return lead ? transformLead(lead) : null;
  },

  async updateLeadReadStatus(id: string, isRead: boolean): Promise<CalculatorLeadResponse> {
    const lead = await prisma.calculatorLead.update({
      where: { id },
      data: { isRead },
    });
    return transformLead(lead);
  },

  async deleteLead(id: string): Promise<void> {
    await prisma.calculatorLead.delete({
      where: { id },
    });
  },

  async updateLeadReadStatusBulk(ids: string[], isRead: boolean): Promise<number> {
    const result = await prisma.calculatorLead.updateMany({
      where: { id: { in: ids } },
      data: { isRead },
    });
    return result.count;
  },

  async deleteLeadsBulk(ids: string[]): Promise<number> {
    const result = await prisma.calculatorLead.deleteMany({
      where: { id: { in: ids } },
    });
    return result.count;
  },

  async getConfig(): Promise<CalculatorConfigInput> {
    const row = await prisma.calculatorConfig.findFirst({
      orderBy: { updatedAt: 'desc' },
    });
    if (!row) return DEFAULT_CALCULATOR_CONFIG;
    const config = row.config as unknown as Record<string, unknown>;
    if (!config.builtAreaSqmRange) {
      config.builtAreaSqmRange = DEFAULT_CALCULATOR_CONFIG.builtAreaSqmRange;
    }
    return config as CalculatorConfigInput;
  },

  async upsertConfig(config: CalculatorConfigInput): Promise<CalculatorConfigInput> {
    const existing = await prisma.calculatorConfig.findFirst({
      orderBy: { updatedAt: 'desc' },
    });
    let row;
    if (existing) {
      row = await prisma.calculatorConfig.update({
        where: { id: existing.id },
        data: { config: config as object },
      });
    } else {
      row = await prisma.calculatorConfig.create({
        data: { config: config as object },
      });
    }
    return row.config as unknown as CalculatorConfigInput;
  },
};
