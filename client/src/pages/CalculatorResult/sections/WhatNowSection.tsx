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
    <section className="breakout-x-padding bg-secondary px-page-all py-section-all">
      <h2 className="subheading text-center font-bold text-primary">מה עכשיו?</h2>
      <p className="mx-auto mt-3 max-w-2xl text-center text-primary/70">
        בואו נבדוק יחד אם הבית שאתם רוצים וההערכה שקיבלתם באמת מתחברים.
      </p>

      <ul className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map(({ icon: Icon, title, description }) => (
          <li
            key={title}
            className="rounded-2xl bg-white p-6 transition-shadow duration-200 ease-out hover-capable:hover:shadow-md motion-reduce:transition-none"
          >
            <span
              className="flex size-11 items-center justify-center rounded-full bg-secondary text-primary"
              aria-hidden
            >
              <Icon className="size-5" />
            </span>
            <h3 className="mt-4 font-bold text-primary">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-primary/70">
              {description}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
