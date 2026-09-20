import { ArrowLeft, Clock, ShieldCheck, Wallet } from 'lucide-react';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import introHero from '@/assets/calculator/intro-hero.webp';

const BADGES = [
  { icon: Clock, label: 'כ-2 דקות' },
  { icon: Wallet, label: 'ללא עלות' },
  { icon: ShieldCheck, label: 'ללא התחייבות' },
];

export function IntroStep({ onStart }: { onStart: () => void }) {
  return (
    <div>
      <h2 className="subheading font-bold text-primary">
        כמה באמת יעלה לבנות את הבית שלכם?
      </h2>
      <p className="mt-3 text-primary/70">
        מתכננים בית פרטי ורוצים להבין את סדר הגודל של ההשקעה? ענו על כמה שאלות
        קצרות וקבלו הערכה ראשונית בהתאמה לבית שאתם מתכננים.
      </p>

      <ul className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4">
        {BADGES.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-2">
            <Icon className="size-5 text-primary" aria-hidden />
            <span className="text-sm font-bold text-primary">{label}</span>
          </li>
        ))}
      </ul>

      <Button
        variant="primary"
        onClick={onStart}
        className="mt-8 flex w-full items-center justify-center gap-2 py-3 sm:w-auto sm:px-12"
      >
        בואו נתחיל
        <ArrowLeft className="size-4" aria-hidden />
      </Button>

      <div className="mt-8 aspect-[3/2] overflow-hidden rounded-xl">
        <Image src={introHero} alt="" className="size-full object-cover" />
      </div>
    </div>
  );
}
