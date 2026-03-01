import { useState, useEffect } from 'react';
import {
  type CalculatorFormInput,
  type CalculatorConfigInput,
  DEFAULT_CALCULATOR_CONFIG,
} from '@shirans/shared';
import { Helmet } from 'react-helmet-async';
import { BASE_URL } from '@/constants/urls';
import { CalculatorForm } from '@/components/Calculator';
import { calculatorService } from '@/services/calculator.service';

export default function LandingCalculator() {
  const [config, setConfig] = useState<CalculatorConfigInput | null>(null);
  const [configLoading, setConfigLoading] = useState(true);

  useEffect(() => {
    calculatorService
      .getConfig()
      .then((c) => setConfig(c ?? DEFAULT_CALCULATOR_CONFIG))
      .catch(() => setConfig(DEFAULT_CALCULATOR_CONFIG))
      .finally(() => setConfigLoading(false));
  }, []);

  const handleSubmit = async (
    data: CalculatorFormInput,
    estimate: { min: number; max: number }
  ) => {
    await calculatorService.submitLead({
      ...data,
      estimateMin: estimate.min,
      estimateMax: estimate.max,
    });
  };

  if (configLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center" dir="rtl">
        <span>טוען מחשבון...</span>
      </div>
    );
  }

  return (
    <main
      dir="rtl"
      className="mx-auto max-w-3xl py-10"
      aria-label="מחשבון אומדן עלות לבנייה פרטית"
    >
      <Helmet>
        <title>מחשבון אומדן עלות - שירן גלעד אדריכלות ועיצוב פנים</title>
        <meta
          name="description"
          content="חשבו אומדן עלות לבנייה פרטית. הזינו פרטים וקבלו טווח מחירים משוער."
        />
        <meta property="og:title" content="מחשבון אומדן עלות - שירן גלעד" />
        <meta property="og:url" content={`${BASE_URL}/calculator`} />
      </Helmet>

      <h1 className="heading mb-8 text-center font-bold">
        מחשבון אומדן עלות לבנייה פרטית
      </h1>

      <CalculatorForm config={config!} onSubmit={handleSubmit} />
    </main>
  );
}
