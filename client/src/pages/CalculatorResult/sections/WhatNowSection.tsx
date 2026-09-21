import { Compass, Home, Lightbulb, Users } from 'lucide-react';

const ITEMS = [
  {
    icon: Users,
    title: 'שיחה אישית וממוקדת',
    description:
      '15-20 דקות בטלפון או בזום, שבהן נכיר את הפרויקט שלכם ונראה איך אפשר להתקדם.',
  },
  {
    icon: Lightbulb,
    title: 'מתאימים את הבית אליכם',
    description:
      'תכנון מדויק לאורח החיים שלכם, לחלומות ולמסגרת התקציבית.',
  },
  {
    icon: Home,
    title: 'בודקים את התמונה המלאה',
    description:
      'מגרש, תכנון, עלויות, שלבים ולוחות זמנים — כדי שתוכלו לקבל החלטות בביטחון.',
  },
  {
    icon: Compass,
    title: 'מכוונים אתכם נכון',
    description:
      'עושים סדר בבחירות, מונעים טעויות יקרות וחוסכים זמן וכסף.',
  },
];

export function WhatNowSection() {
  return (
    // On the warm surface rather than on white. The four points were true and
    // completely cold — a page about someone's house shouldn't read like a
    // specification sheet, and this palette already has the warmer of the two
    // backgrounds.
    // Its own padding is internal only — the band has a background, so its
    // content needs room from the band's edges. The space around the band
    // belongs to the page.
    <section className="bg-surface-sunken px-gutter py-14 md:py-20">
      <h2 className="text-h3 text-center font-bold text-ink">מה עכשיו?</h2>
      <p className="mx-auto mt-3 max-w-2xl text-center text-ink-muted">
        בואו נבדוק יחד אם הבית שאתם רוצים וההערכה שקיבלתם באמת מתחברים.
      </p>

      <ul className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map(({ icon: Icon, title, description }) => (
          <li
            key={title}
            className="rounded-panel bg-surface-raised p-6 transition-shadow duration-200 ease-out hover-capable:hover:shadow-card motion-reduce:transition-none"
          >
            <span
              className="flex size-11 items-center justify-center rounded-full bg-surface-sunken text-ink"
              aria-hidden
            >
              <Icon className="size-5" />
            </span>
            <h3 className="mt-4 font-bold text-ink">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              {description}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
