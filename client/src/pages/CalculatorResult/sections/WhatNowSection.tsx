import { Compass, Home, Lightbulb, Users } from 'lucide-react';

const ITEMS = [
  {
    icon: Users,
    title: 'פגישה אישית וממוקדת',
    description:
      '15–20 דקות בזום או במשרד, שבהן נכיר את הפרויקט שלכם ונראה איך אפשר להתקדם.',
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
    <section className="py-section-all">
      <h2 className="subheading text-center font-bold text-primary">מה עכשיו?</h2>
      <p className="mt-3 text-center text-primary/70">
        בואו נבדוק יחד אם הבית שאתם רוצים וההערכה שקיבלתם באמת מתחברים.
      </p>

      <ul className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map(({ icon: Icon, title, description }) => (
          <li key={title} className="border-primary/10 sm:border-l sm:ps-6 sm:first:border-l-0">
            <Icon className="size-8 text-primary" aria-hidden />
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
