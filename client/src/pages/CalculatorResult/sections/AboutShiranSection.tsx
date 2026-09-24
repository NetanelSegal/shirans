import shiranPortrait from '@/assets/calculator/result-shiran-portrait.webp';
import { ImagePanelSection } from './ImagePanelSection';

/**
 * The page already closes on a full call to action. This block used to carry a
 * second, identical one — same two buttons, same three assurances — which left
 * the page asking twice and squeezed the bio into a column four words wide.
 * It now does only what its name says: introduce the person behind the estimate.
 */
export function AboutShiranSection() {
  return (
    <ImagePanelSection
      image={shiranPortrait}
      alt="שירן גלעד"
      // The text earns the wider share here: it is the only thing in the block.
      columns="lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]"
    >
      <h2 className="text-h2 text-ink">שירן גלעד</h2>
      <p className="mt-1 text-ink-muted">אדריכלית ומעצבת פנים</p>
      <p className="mt-5 max-w-prose leading-relaxed text-ink-muted">
        אני מלווה משפחות בתכנון ובנייה של בתים פרטיים — מהשלבים הראשונים של
        בחירת המגרש, דרך תכנון מותאם ומדויק, ועד ליצירת בית שנעים באמת לחיות
        בו.
      </p>
    </ImagePanelSection>
  );
}
