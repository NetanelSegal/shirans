const answerEnums = {
  projectStage: ['has_plot', 'buying_plot', 'searching_plot', 'exploring'],
  region: ['north', 'center', 'south'],
  levels: ['one', 'two', 'three_with_basement'],
  components: ['pool', 'elevator', 'decorative_pool', 'large_openings', 'landscaping', 'other'],
  finishLevel: ['standard', 'high', 'premium'],
  carpentry: ['ready', 'custom'],
  interiorDesign: ['none', 'partial', 'full'],
  timeline: ['coming_months', '3_6_months', '6_12_months', 'over_year'],
} as const;

/** The nine wizard answers, shared by the request and the response. */
const answerProperties = {
  projectStage: { type: 'string', enum: answerEnums.projectStage },
  region: { type: 'string', enum: answerEnums.region },
  builtAreaSqm: { type: 'integer' },
  levels: { type: 'string', enum: answerEnums.levels },
  components: {
    type: 'array',
    items: { type: 'string', enum: answerEnums.components },
    description: 'May be empty — none of the extras is a valid answer',
  },
  finishLevel: { type: 'string', enum: answerEnums.finishLevel },
  carpentry: { type: 'string', enum: answerEnums.carpentry },
  interiorDesign: { type: 'string', enum: answerEnums.interiorDesign },
  timeline: { type: 'string', enum: answerEnums.timeline },
} as const;

const answerFields = Object.keys(answerProperties);

const multipliers = (keys: readonly string[]) => ({
  type: 'object',
  properties: Object.fromEntries(keys.map((k) => [k, { type: 'number' }])),
});

export const calculatorSchemas = {
  CalculatorLeadResponse: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'cuid' },
      name: { type: 'string' },
      email: { type: 'string', format: 'email' },
      phoneNumber: { type: 'string' },
      marketingConsent: { type: 'boolean' },
      ...answerProperties,
      estimateMin: { type: 'integer' },
      estimateMax: { type: 'integer' },
      isRead: { type: 'boolean' },
      createdAt: { type: 'string', format: 'date-time' },
    },
  },
  SubmitCalculatorLeadRequest: {
    type: 'object',
    description:
      'No estimate field: the server recomputes it from the stored config, so a lead always records the rates that were actually configured.',
    required: [...answerFields, 'name', 'email', 'phoneNumber', 'marketingConsent'],
    properties: {
      name: { type: 'string', minLength: 2, maxLength: 50 },
      email: { type: 'string', format: 'email', maxLength: 50 },
      phoneNumber: { type: 'string', minLength: 10, maxLength: 10 },
      marketingConsent: { type: 'boolean' },
      ...answerProperties,
    },
  },
  CalculatorConfig: {
    type: 'object',
    description:
      'One number per factor. The displayed range comes from rangeSpread applied once at the end, rather than from carrying a min and max through every multiplier.',
    properties: {
      builtAreaSqmRange: {
        type: 'object',
        properties: { min: { type: 'integer' }, max: { type: 'integer' } },
        description: 'Allowed built area range in sqm (e.g. 100-500)',
      },
      baseRatePerSqm: { type: 'number' },
      regionMultipliers: multipliers(answerEnums.region),
      levelsMultipliers: multipliers(answerEnums.levels),
      finishMultipliers: multipliers(answerEnums.finishLevel),
      carpentryAddons: multipliers(answerEnums.carpentry),
      interiorDesignAddons: multipliers(answerEnums.interiorDesign),
      componentAddons: multipliers(answerEnums.components),
      rangeSpread: {
        type: 'number',
        minimum: 0,
        maximum: 0.5,
        description: 'Half-width of the displayed range as a fraction (0.08 = ±8%)',
      },
      vatMultiplier: {
        type: 'number',
        description: 'Kept for reference; the displayed estimate is pre-VAT',
      },
    },
  },
};
