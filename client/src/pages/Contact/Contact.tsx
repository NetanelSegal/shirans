import EnterAnimation from '@/components/animations/EnterAnimation';
import PageSeo from '@/components/Seo/PageSeo';
import ContactInfo from '@/components/Footer/components/ContactInfo';
import FooterForm from '@/components/Footer/components/FooterForm';

const CONTACT_TITLE = 'צור קשר - שירן גלעד אדריכלות ועיצוב פנים';
const CONTACT_DESCRIPTION =
  'צרו קשר עם שירן גלעד לתכנון ועיצוב בית פרטי. השאירו פרטים ונחזור אליכם בהקדם.';

export default function Contact() {
  return (
    <>
      <PageSeo
        title={CONTACT_TITLE}
        description={CONTACT_DESCRIPTION}
        path="/contact"
      />
      <main dir="rtl">
        <EnterAnimation>
          <div className="py-10 text-center">
            <h1 className="heading mb-4 font-bold">צור קשר</h1>
            <p className="paragraph px-[10vw] font-semibold">
              מוזמנים להשאיר פרטים ונחזור אליכם לשיחת ייעוץ ראשונית — ללא
              התחייבות.
            </p>
          </div>
        </EnterAnimation>

        <section
          aria-labelledby="contact-details-heading"
          className="breakout-x-padding bg-primary px-page-all py-section-all text-white"
        >
          <EnterAnimation delay={0.1}>
            <h2 id="contact-details-heading" className="heading mb-6 font-semibold">
              פרטי התקשרות
            </h2>
            <ContactInfo />
          </EnterAnimation>

          <EnterAnimation delay={0.2}>
            <h2 className="heading mb-4 mt-10 font-semibold">
              להשארת פרטים לחזרה
            </h2>
            <FooterForm />
          </EnterAnimation>
        </section>
      </main>
    </>
  );
}
