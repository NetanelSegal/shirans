import { Building2, Eye, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageSeo from '@/components/Seo/PageSeo';
import EnterAnimation from '@/components/animations/EnterAnimation';
import Image from '@/components/ui/Image';
import heroImage from '@/assets/calculator/intro-hero.webp';
import { CostCalculator, type CostCalculatorResult } from '@/components/CostCalculator';
import { useCalculatorConfig } from '@/hooks/useCalculatorConfig';
import { ErrorState, LoadingState } from '@/components/DataState';
import { submitCalculatorLead } from './submitCalculatorLead';
import { getPageMeta } from '@/constants/pageMeta';

const PAGE_META = getPageMeta('/calculator');

const BENEFITS = [
  {
    icon: Building2,
    title: 'אומדן מבוסס על מאות פרויקטים',
    description: 'נתוני עלות אמיתיים מפרויקטי בנייה פרטית.',
  },
  {
    icon: Zap,
    title: 'תשובה מיידית — בלי לחכות',
    description: 'תוצאה תוך דקות, ללא טופסי צפייה או המתנה.',
  },
  {
    icon: Eye,
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
    <main
      dir="rtl"
      className="min-h-screen"
      aria-label="מחשבון אומדן עלות לבנייה פרטית"
    >
      <PageSeo
        title={PAGE_META.title}
        description={PAGE_META.description}
        image={PAGE_META.image}
        imageAlt={PAGE_META.imageAlt}
        path="/calculator"
      />

      {/* Hero — the site leads with architecture everywhere else; this page was
          the one that led with a coloured rectangle. Shorter than the home
          hero so the wizard's top edge stays in view and invites the scroll. */}
      <section className="breakout-x-padding relative h-[58dvh] min-h-[26rem] overflow-hidden 2xl:-mx-page-2xl">
        <Image
          src={heroImage}
          alt=""
          className="absolute inset-0 size-full object-cover"
          fadeIn={false}
        />
        {/* Carries the white type over a bright photo; the home hero gets this
            from its own dark footage. */}
        <div className="absolute inset-0 bg-primary/70" aria-hidden />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-page-all text-center">
          <EnterAnimation delay={0.2} duration={1} translateY={false}>
            <h1 className="mx-auto max-w-4xl text-balance text-4xl font-bold leading-[1.1] tracking-[-0.02em] text-on-dark md:text-5xl xl:text-6xl">
              דמיינו את הבית החדש שלכם.
              <br />
              עכשיו גלו את טווח העלות האמיתי.
            </h1>
            <p className="text-body mx-auto mt-5 max-w-xl text-on-dark">
              מחשבון אומדן עלות לבנייה פרטית — תוצאה תוך דקות. ללא התחייבות.
            </p>
          </EnterAnimation>
        </div>
      </section>

      {/* Three claims, not three boxes. Hairline columns are the device this
          site already uses for a supporting row, and dropping the cards lets
          the wizard below be the loudest thing on the page. */}
      <section
        className="breakout-x-padding bg-surface-sunken px-page-all py-10 md:py-14"
        aria-label="מה תקבלו"
      >
        <ul className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-3 sm:gap-0">
          {BENEFITS.map(({ icon: Icon, title, description }) => (
            <li
              key={title}
              className="border-primary/15 sm:border-s sm:ps-8 sm:first:border-s-0 sm:first:ps-0"
            >
              <Icon className="size-6 text-ink" aria-hidden />
              <h2 className="mt-3 text-lg font-bold leading-snug text-ink">
                {title}
              </h2>
              <p className="mt-2 text-ink-muted">{description}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* The wizard itself. `showIntro` is off because this page's hero already
          does that job — a landing page without its own hero can leave it on. */}
      <section className="py-12 md:py-16" aria-label="מחשבון עלות הבית">
        <div className="mx-auto max-w-3xl">
          {configError ? (
            <ErrorState message={configError} onRetry={refreshConfig} />
          ) : isConfigLoading || !config ? (
            <LoadingState minHeight="28rem" />
          ) : (
            <CostCalculator
              config={config}
              showIntro={false}
              onComplete={handleComplete}
            />
          )}
        </div>
      </section>
    </main>
  );
}
