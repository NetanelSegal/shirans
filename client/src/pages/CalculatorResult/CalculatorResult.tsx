import { useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import PageSeo from '@/components/Seo/PageSeo';
import Testimonials from '@/pages/Home/components/Testimonials';
import resultCta from '@/assets/calculator/result-cta.webp';
import { AboutShiranSection } from './sections/AboutShiranSection';
import { ContactCtaSection } from './sections/ContactCtaSection';
import { ImagePanelSection } from './sections/ImagePanelSection';
import { ResultHero } from './sections/ResultHero';
import { StickyContactBar } from './sections/StickyContactBar';
import { WhatNowSection } from './sections/WhatNowSection';
import { readResult, type StoredResult } from './resultStorage';
import { useHideWhenReached } from './useHideWhenReached';
import { buildWhatsAppHref } from '@/constants/contact';
import { buildLeadWhatsAppMessage } from './whatsappMessage';

export default function CalculatorResult() {
  // Read before the first paint rather than in an effect: reading it afterwards
  // meant one frame of blank page for everyone, to cover a case that only
  // matters if this ever renders on a server.
  const [result] = useState<StoredResult | null>(readResult);
  const closingCtaRef = useRef<HTMLElement>(null);
  const showStickyBar = useHideWhenReached(closingCtaRef);


  // Nothing stored means there is no estimate to show — send them to the wizard.
  if (result === null) return <Navigate to="/calculator" replace />;

  // One message for both controls: the answers, the estimate, and a link to the
  // lead this page came from. Built after the guard, so it never has to account
  // for a result that isn't there.
  const whatsappHref = buildWhatsAppHref(buildLeadWhatsAppMessage(result));

  return (
    // The page owns the space between its sections, as one gap. Each section
    // used to bring its own padding, and only some did: the photo panels had
    // none, the rest had `py-section` — 16px on a phone, 128px on a
    // desktop. So neighbours either touched or sat an arbitrary distance apart,
    // and the coloured "what now" band ran straight into the cards on both
    // sides of it. The bottom padding is deeper than the rhythm because the
    // floating bar overlays the end of the page.
    <div
      dir="rtl"
      className="flex flex-col gap-14 bg-surface px-gutter pb-32 pt-nav md:gap-20 lg:gap-24"
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

      <section>
        <h2 className="text-h3 text-center text-ink">
          כך מספרים על הדרך המשותפת
        </h2>
        <Testimonials />
      </section>

      <ImagePanelSection image={resultCta} sectionRef={closingCtaRef}>
        <ContactCtaSection
          title="מוכנים להתחיל את הצעד הבא?"
          subtitle="בואו לדבר על הבית שלכם."
          whatsappHref={whatsappHref}
        />
      </ImagePanelSection>

      <StickyContactBar visible={showStickyBar} whatsappHref={whatsappHref} />
    </div>
  );
}
