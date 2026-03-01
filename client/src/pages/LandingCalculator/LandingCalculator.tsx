import type { CalculatorFormInput } from '@shirans/shared';
import { Helmet } from 'react-helmet-async';
import { BASE_URL } from '@/constants/urls';
import { CalculatorForm } from '@/components/Calculator';
import { calculatorService } from '@/services/calculator.service';
import { useCalculatorConfig } from '@/hooks/useCalculatorConfig';
import EnterAnimation from '@/components/animations/EnterAnimation';

const BENEFITS = [
  {
    title: 'אומדן מבוסס על מאות פרויקטים',
    description: 'נתוני עלות אמיתיים מפרויקטי בנייה פרטית.',
  },
  {
    title: 'תשובה מיידית — בלי לחכות',
    description: 'תוצאה תוך דקות, ללא טופסי צפייה או המתנה.',
  },
  {
    title: 'טווח מחירים שקוף לפני שיחה ראשונה',
    description: 'גלו את טווח העלות לפני שמתקשרים.',
  },
];

export default function LandingCalculator() {
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
      className="min-h-screen"
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

      {/* Hero section */}
      <section className="breakout-x-padding bg-primary px-page-all py-16 text-white md:py-20 lg:py-24">
        <EnterAnimation delay={0.2} duration={1} translateY={false}>
          <h1 className="heading mb-4 text-center font-bold">
            דמיינו את הבית החדש שלכם. עכשיו גלו את טווח העלות האמיתי.
          </h1>
          <p className="paragraph mx-auto max-w-2xl text-center text-white/90">
            מחשבון אומדן עלות לבנייה פרטית — תוצאה תוך דקות. ללא התחייבות.
          </p>
        </EnterAnimation>
      </section>

      {/* Value props section */}
      <section
        className="breakout-x-padding bg-secondary px-page-all py-12 md:py-16"
        aria-labelledby="benefits-heading"
      >
        <EnterAnimation delay={0.2}>
          <h2
            id="benefits-heading"
            className="subheading mb-10 text-center font-semibold text-primary"
          >
            מה תקבלו
          </h2>
        </EnterAnimation>
        <ul className="container mx-auto grid max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((item, i) => (
            <EnterAnimation key={item.title} delay={0.1 * (i + 1)}>
              <li className="rounded-xl border border-primary/10 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <h3 className="mb-2 font-semibold text-primary">
                  {item.title}
                </h3>
                <p className="text-slate-600">{item.description}</p>
              </li>
            </EnterAnimation>
          ))}
        </ul>
      </section>

      {/* Form section */}
      <section
        className="py-12 md:py-16"
        aria-labelledby="form-heading"
      >
        <EnterAnimation>
          <h2
            id="form-heading"
            className="subheading mb-8 text-center font-semibold text-primary"
          >
            הצגת אומדן תקציב
          </h2>
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-md md:p-8">
            {config && <CalculatorForm config={config} onSubmit={handleSubmit} />}
          </div>
        </EnterAnimation>
      </section>
    </main>
  );
}
