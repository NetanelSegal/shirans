import { useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import PageSeo from '@/components/Seo/PageSeo';
import Image from '@/components/ui/Image';
import Testimonials from '@/pages/Home/components/Testimonials';
import resultCta from '@/assets/calculator/result-cta.webp';
import { AboutShiranSection } from './sections/AboutShiranSection';
import { ContactCtaSection } from './sections/ContactCtaSection';
import { ResultHero } from './sections/ResultHero';
import { StickyContactBar } from './sections/StickyContactBar';
import { WhatNowSection } from './sections/WhatNowSection';
import { readResult, type StoredResult } from './resultStorage';
import { useHideWhenReached } from './useHideWhenReached';

export default function CalculatorResult() {
  // Read before the first paint rather than in an effect: reading it afterwards
  // meant one frame of blank page for everyone, to cover a case that only
  // matters if this ever renders on a server.
  const [result] = useState<StoredResult | null>(readResult);
  const closingCtaRef = useRef<HTMLElement>(null);
  const showStickyBar = useHideWhenReached(closingCtaRef);

  // Nothing stored means there is no estimate to show — send them to the wizard.
  if (result === null) return <Navigate to="/calculator" replace />;

  return (
    // Full-bleed background, the same idiom the rest of the site uses — no page
    // here should depend on the browser's default page colour. The bottom
    // padding is deeper than the section rhythm because the floating bar
    // overlays the end of the page.
    <main
      dir="rtl"
      className="breakout-x-padding bg-white px-page-all py-section-all pb-32"
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

      <section
        ref={closingCtaRef}
        className="grid grid-cols-1 overflow-hidden rounded-2xl lg:grid-cols-2"
      >
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

      <StickyContactBar visible={showStickyBar} />
    </main>
  );
}
