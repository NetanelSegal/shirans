import { formatShekels } from '@shirans/shared';
import type { CostRange } from '@shirans/shared';
import Image from '@/components/ui/Image';
import resultHero from '@/assets/calculator/result-hero.webp';

export function ResultHero({ estimate }: { estimate: CostRange }) {
  return (
    <section className="grid grid-cols-1 items-stretch gap-0 overflow-hidden rounded-2xl lg:grid-cols-2">
      <div className="min-h-64 lg:min-h-full">
        <Image src={resultHero} alt="" className="size-full object-cover" />
      </div>

      <div className="bg-secondary p-8 md:p-12">
        <p className="font-bold text-primary/60">תודה!</p>
        <h1 className="subheading mt-2 font-bold text-primary">
          ההערכה הראשונית שלכם מוכנה
        </h1>
        <p className="mt-4 text-primary/70">
          בהתאם לתשובות שמסרתם במחשבון, סדר הגודל המשוער לבניית הבית שלכם הוא:
        </p>

        {/* Each amount stays one unbreakable unit with the dash as its own
            element — a single "1,000 ₪ – 2,000 ₪" string gets reordered by bidi
            in this RTL context and the dash drifts to the wrong end. */}
        <p className="mt-6 flex flex-wrap items-center justify-center gap-x-3 rounded-xl bg-white px-6 py-5 text-center text-3xl font-bold text-primary md:text-4xl">
          <span className="whitespace-nowrap">{formatShekels(estimate.min)} ₪</span>
          <span aria-hidden>–</span>
          <span className="whitespace-nowrap">{formatShekels(estimate.max)} ₪</span>
        </p>

        <p className="mt-6 text-sm leading-relaxed text-primary/60">
          ההערכה מבוססת על הנתונים שמסרתם ונועדה לתת נקודת פתיחה בלבד. היא אינה
          הצעת מחיר, כתב כמויות או אומדן מקצועי לבדיקת הפרויקט הספציפי, ואינה
          כוללת מע״מ.
        </p>
      </div>
    </section>
  );
}
