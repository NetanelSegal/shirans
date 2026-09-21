import { ShekelAmount } from '@/components/ui/ShekelAmount';
import resultHero from '@/assets/calculator/result-hero.webp';
import { ImagePanelSection } from './ImagePanelSection';

export function ResultHero({ estimate }: { estimate: number }) {
  return (
    <ImagePanelSection image={resultHero} minHeight="lg:min-h-[26rem]">
      <h1 className="subheading font-bold text-primary">
        תודה! ההערכה הראשונית שלכם מוכנה
      </h1>
      <p className="mt-4 text-primary/70">
        בהתאם לתשובות שמסרתם במחשבון, סדר הגודל המשוער לבניית הבית שלכם הוא:
      </p>

      {/* Fluid rather than stepped: the column this sits in is narrowest at
          `lg`, not on a phone. */}
      <ShekelAmount
        value={estimate}
        className="mt-6 block rounded-xl bg-white px-4 py-5 text-center text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight text-primary"
      />

      <p className="mt-6 text-sm leading-relaxed text-primary/70">
        ההערכה מבוססת על הנתונים שמסרתם ונועדה לתת נקודת פתיחה בלבד. היא אינה
        הצעת מחיר, כתב כמויות או אומדן מקצועי לבדיקת הפרויקט הספציפי, ואינה
        כוללת מע״מ.
      </p>
    </ImagePanelSection>
  );
}
