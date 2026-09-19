import Image from '@/components/ui/Image';
import shiranPortrait from '@/assets/calculator/result-shiran-portrait.webp';
import { ContactCtaSection } from './ContactCtaSection';

export function AboutShiranSection() {
  return (
    <section className="grid grid-cols-1 overflow-hidden rounded-2xl lg:grid-cols-2">
      <div className="bg-secondary p-8 md:p-12">
        <ContactCtaSection
          title="בואו נדבר על הבית שלכם"
          subtitle="השאירו פרטים ונקבע שיחת היכרות בזמן שנוח לכם."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:order-first">
        <div className="min-h-64">
          <Image src={shiranPortrait} alt="שירן גלעד" className="size-full object-cover" />
        </div>
        <div className="bg-white p-8">
          <h3 className="text-xl font-bold text-primary">שירן גלעד</h3>
          <p className="mt-1 text-sm text-primary/60">אדריכלית ומעצבת פנים</p>
          <p className="mt-4 text-sm leading-relaxed text-primary/70">
            אני מלווה משפחות בתכנון ובנייה של בתים פרטיים — מהשלבים הראשונים של
            בחירת המגרש, דרך תכנון מותאם ומדויק, ועד ליצירת בית שנעים באמת לחיות
            בו.
          </p>
        </div>
      </div>
    </section>
  );
}
