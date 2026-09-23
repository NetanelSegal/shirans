import { useNavigate } from 'react-router-dom';
import PageSeo from '@/components/Seo/PageSeo';
import { PageHero } from '@/components/ui/PageHero';
import { Section } from '@/components/ui/Section';
import { FeatureStrip, type Feature } from '@/components/ui/FeatureStrip';
import heroImage from '@/assets/calculator/intro-hero.webp';
import { CostCalculator, type CostCalculatorResult } from '@/components/CostCalculator';
import { useCalculatorConfig } from '@/hooks/useCalculatorConfig';
import { ErrorState, LoadingState } from '@/components/DataState';
import { submitCalculatorLead } from './submitCalculatorLead';
import { getPageMeta } from '@/constants/pageMeta';

const PAGE_META = getPageMeta('/calculator');

const BENEFITS: Feature[] = [
  {
    icon: 'building',
    title: 'אומדן מבוסס על מאות פרויקטים',
    description: 'נתוני עלות אמיתיים מפרויקטי בנייה פרטית.',
  },
  {
    icon: 'clock',
    title: 'תשובה מיידית — בלי לחכות',
    description: 'תוצאה תוך דקות, ללא טופסי צפייה או המתנה.',
  },
  {
    icon: 'checklist',
    title: 'טווח מחירים שקוף לפני שיחה ראשונה',
    description: 'גלו את טווח העלות לפני שמתקשרים.',
  },
];

export default function LandingCalculator() {
  const navigate = useNavigate();
  // Shiran's rates from the admin screen.
  //
  // The wizard waits for them rather than starting on the shipped defaults. It
  // isn't only that the estimate would be wrong: the area step takes its bounds
  // from the same config, so a visitor seeded against the wrong range answers
  // nine questions and is then rejected by the server's bounds check with a
  // generic error that retrying can never clear.
  const {
    config,
    isLoading: isConfigLoading,
    error: configError,
    refresh: refreshConfig,
  } = useCalculatorConfig();

  // Throwing here is deliberate: the wizard catches it and keeps the visitor on
  // the contact step with a retry, rather than sending them to a result page
  // for a lead that was never saved.
  const handleComplete = async (result: CostCalculatorResult) => {
    await submitCalculatorLead(result);
    navigate('/calculator/result');
  };

  return (
    <>
      <PageSeo
        title={PAGE_META.title}
        description={PAGE_META.description}
        image={PAGE_META.image}
        imageAlt={PAGE_META.imageAlt}
        path="/calculator"
      />

      <PageHero
        titleId="calculator-hero-title"
        image={heroImage}
        title={
          <>
            דמיינו את הבית החדש שלכם.
            <br />
            עכשיו גלו את טווח העלות האמיתי.
          </>
        }
        subtitle="מחשבון אומדן עלות לבנייה פרטית — תוצאה תוך דקות. ללא התחייבות."
      />

      {/* Three claims on the site's own hairline strip, not three boxes. */}
      <Section tone="sunken" spacing="tight" aria-label="מה תקבלו">
        <FeatureStrip items={BENEFITS} />
      </Section>

      {/* The wizard. `showIntro` is off because the hero above already does
          that job — a landing page without its own hero can leave it on. */}
      <Section aria-label="מחשבון עלות הבית" container="narrow">
        {configError ? (
          <ErrorState message={configError} onRetry={refreshConfig} />
        ) : isConfigLoading || !config ? (
          <LoadingState minHeight="28rem" />
        ) : (
          <CostCalculator config={config} showIntro={false} onComplete={handleComplete} />
        )}
      </Section>
    </>
  );
}
