import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import PageSeo from '@/components/Seo/PageSeo';
import Image from '@/components/ui/Image';
import Testimonials from '@/pages/Home/components/Testimonials';
import resultCta from '@/assets/calculator/result-cta.webp';
import { AboutShiranSection } from './sections/AboutShiranSection';
import { ContactCtaSection } from './sections/ContactCtaSection';
import { ResultHero } from './sections/ResultHero';
import { WhatNowSection } from './sections/WhatNowSection';
import { readResult, type StoredResult } from './resultStorage';

export default function CalculatorResult() {
  const [result, setResult] = useState<StoredResult | null | undefined>(undefined);

  useEffect(() => {
    setResult(readResult());
  }, []);

  // `undefined` = not read yet; `null` = nothing stored, so there is no result to show.
  if (result === undefined) return null;
  if (result === null) return <Navigate to="/calculator" replace />;

  return (
    // Full-bleed background, the same idiom the rest of the site uses — no page
    // here should depend on the browser's default page colour.
    <main
      dir="rtl"
      className="breakout-x-padding bg-white px-page-all py-section-all"
    >
      <PageSeo
        title="ההערכה שלכם - מחשבון עלות הבית | שירן גלעד"
        description="ההערכה הראשונית לעלות בניית הבית שלכם, על בסיס התשובות שמסרתם במחשבון."
        path="/calculator/result"
        noIndex
      />

      <ResultHero estimate={result.estimate} />

      <WhatNowSection />

      <AboutShiranSection />

      <section className="py-section-all">
        <h2 className="subheading text-center font-bold text-primary">
          כך מספרים על הדרך המשותפת
        </h2>
        <Testimonials />
      </section>

      <section className="grid grid-cols-1 overflow-hidden rounded-2xl lg:grid-cols-2">
        <div className="min-h-64">
          <Image src={resultCta} alt="" className="size-full object-cover" />
        </div>
        <div className="bg-secondary p-8 md:p-12">
          <ContactCtaSection
            title="מוכנים להתחיל את הצעד הבא?"
            subtitle="בואו לדבר על הבית שלכם."
          />
        </div>
      </section>
    </main>
  );
}
