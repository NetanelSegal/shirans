import Image from '@/components/ui/Image';
import shiranPortrait from '@/assets/calculator/result-shiran-portrait.webp';

/**
 * The page already closes on a full call to action. This block used to carry a
 * second, identical one — same two buttons, same three assurances — which left
 * the page asking twice and squeezed the bio into a column four words wide.
 * It now does only what its name says: introduce the person behind the estimate.
 */
export function AboutShiranSection() {
  return (
    <section className="grid grid-cols-1 overflow-hidden rounded-2xl md:min-h-[24rem] md:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
      {/* Positioned rather than in flow, so the portrait's own proportions can't
          set the row height and leave the text panel padded out with empty
          space below it. */}
      <div className="relative min-h-64 md:min-h-full">
        <Image
          src={shiranPortrait}
          alt="שירן גלעד"
          className="absolute inset-0 size-full object-cover"
        />
      </div>

      <div className="flex flex-col justify-center bg-secondary p-8 md:p-12">
        <h2 className="text-2xl font-bold text-primary md:text-3xl">שירן גלעד</h2>
        <p className="mt-1 text-primary/70">אדריכלית ומעצבת פנים</p>
        <p className="mt-5 max-w-prose leading-relaxed text-primary/70">
          אני מלווה משפחות בתכנון ובנייה של בתים פרטיים — מהשלבים הראשונים של
          בחירת המגרש, דרך תכנון מותאם ומדויק, ועד ליצירת בית שנעים באמת לחיות
          בו.
        </p>
      </div>
    </section>
  );
}
