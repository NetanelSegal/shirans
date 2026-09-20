import type { CostRange } from '@shirans/shared';
import { ShekelRange } from '@/components/ui/ShekelRange';
import resultHero from '@/assets/calculator/result-hero.webp';
import { ImagePanelSection } from './ImagePanelSection';

export function ResultHero({ estimate }: { estimate: CostRange }) {
  return (
    <ImagePanelSection image={resultHero} minHeight="lg:min-h-[26rem]">
      <h1 className="subheading font-bold text-primary">
        תודה! ההערכה הראשונית שלכם מוכנה
      </h1>
      <p className="mt-4 text-primary/70">
        בהתאם לתשובות שמסרתם במחשבון, סדר הגודל המשוער לבניית הבית שלכם הוא:
      </p>

      {/* The size is fluid rather than stepped because the column this sits in
          is narrowest at `lg`, not on a phone: at a fixed `text-4xl` the range
          broke onto two lines with the dash stranded at the end of the first.
          The clamp keeps it on one line from 375px up. */}
      <ShekelRange
        min={estimate.min}
        max={estimate.max}
        className="mt-6 rounded-xl bg-white px-4 py-5 text-center text-[clamp(1.25rem,2.3vw,1.875rem)] font-bold leading-tight text-primary"
      />

      <p className="mt-6 text-sm leading-relaxed text-primary/70">
        ההערכה מבוססת על הנתונים שמסרתם ונועדה לתת נקודת פתיחה בלבד. היא אינה
        הצעת מחיר, כתב כמויות או אומדן מקצועי לבדיקת הפרויקט הספציפי, ואינה
        כוללת מע״מ.
      </p>
    </ImagePanelSection>
  );
}
