import { ShekelAmount } from '@/components/ui/ShekelAmount';
import resultHero from '@/assets/calculator/result-hero.webp';
import { ImagePanelSection } from './ImagePanelSection';

export function ResultHero({ estimate }: { estimate: number }) {
  return (
    <ImagePanelSection image={resultHero} minHeight="lg:min-h-[26rem]">
      <h1 className="text-h3 font-bold text-ink">
        תודה! ההערכה הראשונית שלכם מוכנה
      </h1>
      <p className="mt-4 text-ink-muted">
        בהתאם לתשובות שמסרתם במחשבון, סדר הגודל המשוער לבניית הבית שלכם הוא:
      </p>

      {/* Fluid rather than stepped: the column this sits in is narrowest at
          `lg`, not on a phone. */}
      <ShekelAmount
        value={estimate}
        className="mt-6 block rounded-card bg-surface-raised px-4 py-5 text-center text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight text-ink"
      />

      <p className="mt-6 text-sm leading-relaxed text-ink-muted">
        ההערכה מבוססת על הנתונים שמסרתם ונועדה לתת נקודת פתיחה בלבד. היא אינה
        הצעת מחיר, כתב כמויות או אומדן מקצועי לבדיקת הפרויקט הספציפי, ואינה
        כוללת מע״מ.
      </p>
    </ImagePanelSection>
  );
}
