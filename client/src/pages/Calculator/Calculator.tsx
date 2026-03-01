import type { CalculatorFormInput } from '@shirans/shared';
import { Helmet } from 'react-helmet-async';
import { BASE_URL } from '@/constants/urls';
import { CalculatorForm } from '@/components/Calculator';
import { calculatorService } from '@/services/calculator.service';
import { useCalculatorConfig } from '@/hooks/useCalculatorConfig';

export default function Calculator() {
  const { config, isLoading: configLoading } = useCalculatorConfig();

  const handleSubmit = async (data: CalculatorFormInput, estimate: number) => {
    await calculatorService.submitLeadFromForm(data, estimate);
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
        <meta property="og:url" content={`${BASE_URL}/admin/calculator`} />
      </Helmet>

      <h1 className="heading mb-8 text-center font-bold">
        מחשבון אומדן עלות לבנייה פרטית
      </h1>

      {config && <CalculatorForm config={config} onSubmit={handleSubmit} />}
    </main>
  );
}
