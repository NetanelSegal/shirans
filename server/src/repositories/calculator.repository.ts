import { prisma } from '../config/database';
import {
  costCalculatorConfigSchema,
  DEFAULT_COST_CALCULATOR_CONFIG,
} from '@shirans/shared';
import type {
  CalculatorComponent,
  Carpentry,
  CostCalculatorConfig,
  CostCalculatorLeadResponse,
  CostRange,
  FinishLevel,
  InteriorDesign,
  Levels,
  ProjectStage,
  Region,
  SubmitCostCalculatorLeadInput,
  Timeline,
} from '@shirans/shared';
import logger from '../middleware/logger';

/** The row shape Prisma returns, narrowed back to the shared enum types. */
interface LeadRow {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  marketingConsent: boolean;
  projectStage: string;
  region: string;
  builtAreaSqm: number;
  levels: string;
  components: string[];
  finishLevel: string;
  carpentry: string;
  interiorDesign: string;
  timeline: string;
  estimateMin: number;
  estimateMax: number;
  isRead: boolean;
  createdAt: Date;
}

/**
 * The answers are stored as plain strings — see the schema comment — so they are
 * cast back on the way out. Rows only ever get here through the submit schema,
 * which is where the values are actually checked.
 */
function transformLead(lead: LeadRow): CostCalculatorLeadResponse {
  return {
    id: lead.id,
    name: lead.name,
    email: lead.email,
    phoneNumber: lead.phoneNumber,
    marketingConsent: lead.marketingConsent,
    projectStage: lead.projectStage as ProjectStage,
    region: lead.region as Region,
    builtAreaSqm: lead.builtAreaSqm,
    levels: lead.levels as Levels,
    components: lead.components as CalculatorComponent[],
    finishLevel: lead.finishLevel as FinishLevel,
    carpentry: lead.carpentry as Carpentry,
    interiorDesign: lead.interiorDesign as InteriorDesign,
    timeline: lead.timeline as Timeline,
    estimateMin: lead.estimateMin,
    estimateMax: lead.estimateMax,
    isRead: lead.isRead,
    createdAt: lead.createdAt.toISOString(),
  };
}

export const calculatorRepository = {
  async createLead(
    data: SubmitCostCalculatorLeadInput,
    estimate: CostRange,
  ): Promise<CostCalculatorLeadResponse> {
    const lead = await prisma.costCalculatorLead.create({
      data: {
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        marketingConsent: data.marketingConsent,
        projectStage: data.projectStage,
        region: data.region,
        builtAreaSqm: data.builtAreaSqm,
        levels: data.levels,
        components: data.components,
        finishLevel: data.finishLevel,
        carpentry: data.carpentry,
        interiorDesign: data.interiorDesign,
        timeline: data.timeline,
        estimateMin: estimate.min,
        estimateMax: estimate.max,
      },
    });
    return transformLead(lead);
  },

  async findAllLeads(filters?: {
    isRead?: boolean;
  }): Promise<CostCalculatorLeadResponse[]> {
    const leads = await prisma.costCalculatorLead.findMany({
      where: filters?.isRead === undefined ? {} : { isRead: filters.isRead },
      orderBy: { createdAt: 'desc' },
    });
    return leads.map(transformLead);
  },

  async findLeadById(id: string): Promise<CostCalculatorLeadResponse | null> {
    const lead = await prisma.costCalculatorLead.findUnique({ where: { id } });
    return lead ? transformLead(lead) : null;
  },

  async updateLeadReadStatus(
    id: string,
    isRead: boolean,
  ): Promise<CostCalculatorLeadResponse> {
    const lead = await prisma.costCalculatorLead.update({
      where: { id },
      data: { isRead },
    });
    return transformLead(lead);
  },

  async deleteLead(id: string): Promise<void> {
    await prisma.costCalculatorLead.delete({ where: { id } });
  },

  async updateLeadReadStatusBulk(ids: string[], isRead: boolean): Promise<number> {
    const result = await prisma.costCalculatorLead.updateMany({
      where: { id: { in: ids } },
      data: { isRead },
    });
    return result.count;
  },

  async deleteLeadsBulk(ids: string[]): Promise<number> {
    const result = await prisma.costCalculatorLead.deleteMany({
      where: { id: { in: ids } },
    });
    return result.count;
  },

  /**
   * A stored config that no longer matches the schema — an older shape, a
   * hand-edited row — falls back to the defaults rather than propagating
   * nonsense into every estimate. It is logged, because silently quoting
   * different numbers than the admin screen shows would be worse than loud.
   */
  async getConfig(): Promise<CostCalculatorConfig> {
    const row = await prisma.costCalculatorConfig.findFirst({
      orderBy: { updatedAt: 'desc' },
    });
    if (!row) return DEFAULT_COST_CALCULATOR_CONFIG;

    const parsed = costCalculatorConfigSchema.safeParse(row.config);
    if (parsed.success) return parsed.data;

    logger.error('Stored cost calculator config is invalid, using defaults', {
      issues: parsed.error.issues,
    });
    return DEFAULT_COST_CALCULATOR_CONFIG;
  },

  async upsertConfig(config: CostCalculatorConfig): Promise<CostCalculatorConfig> {
    const existing = await prisma.costCalculatorConfig.findFirst({
      orderBy: { updatedAt: 'desc' },
    });

    const row = existing
      ? await prisma.costCalculatorConfig.update({
          where: { id: existing.id },
          data: { config },
        })
      : await prisma.costCalculatorConfig.create({ data: { config } });

    return costCalculatorConfigSchema.parse(row.config);
  },
};
