import EnterAnimation from '@/components/animations/EnterAnimation';
import PageSeo from '@/components/Seo/PageSeo';
import ContactInfo from '@/components/Footer/components/ContactInfo';
import FooterForm from '@/components/Footer/components/FooterForm';
import { getPageMeta } from '@/constants/pageMeta';

const PAGE_META = getPageMeta('/contact');

export default function Contact() {
  return (
    <>
      <PageSeo
        title={PAGE_META.title}
        description={PAGE_META.description}
        path="/contact"
      />
      <main dir="rtl">
        <EnterAnimation>
          <div className="py-10 text-center">
            <h1 className="text-h2 mb-4 font-bold">צור קשר</h1>
            <p className="text-body px-[10vw] font-semibold">
              מוזמנים להשאיר פרטים ונחזור אליכם לשיחת ייעוץ ראשונית — ללא
              התחייבות.
            </p>
          </div>
        </EnterAnimation>

        <section
          aria-labelledby="contact-details-heading"
          className="breakout-x-padding bg-primary px-page-all py-section-all text-on-dark"
        >
          <EnterAnimation delay={0.1}>
            <h2 id="contact-details-heading" className="text-h2 mb-6 font-semibold">
              פרטי התקשרות
            </h2>
            <ContactInfo />
          </EnterAnimation>

          <EnterAnimation delay={0.2}>
            <h2 className="text-h2 mb-4 mt-10 font-semibold">
              להשארת פרטים לחזרה
            </h2>
            <div className="rounded-card bg-surface-raised p-4 text-dark shadow-card md:p-6">
              <FooterForm />
            </div>
          </EnterAnimation>
        </section>
      </main>
    </>
  );
}
