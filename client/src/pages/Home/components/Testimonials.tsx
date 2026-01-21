import { useScreenContext } from '@/contexts/ScreenProvider';
import { motion, useMotionValue, animate } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

const testimonials = [
  {
    name: 'משפחת קליין',
    message: `חד משמעית לא ראיתי בעלת מקצוע כזאת!!! התחלנו יחד תהליך של בניית בית פרטי מ0 שירן ליוותה אותנו ויש בה הכל..החל מראש פתוח..זמינות בשעות שלא תאמינו אבל כן היינו מתכתבים גם ב 12 בלילה חרוצה מקצועית יש לה תשובה הפיתרון לכל דבר ..יצירתית ובלי שתשימו לב עושה דברים שהיא לא אמורה לעשות בכלל בקיצור אני אישית ממליץ מאוד וכמובן שכבר העברתי לה כמה פרוייקטים ..כי פשוט מגיע לה
אם יש שאלות או רוצים לראות. את העבודה שלה תגידו לה שתפנה אותכם אליי`,
  },
  {
    name: 'משפחת חרבי',
    message: `איזה מזל יש לנו שהגענו אלייך!!!
כל כך מוכשרת, מסורה, מקצועית!
יש לך את כל התשובות והידע שצריך לתהליך הזה! ואת היכולת המטורפת להבין טוב טוב את האנשים שעומדים מולך!
ללמוד אותם, את החלומות שלהם, את הצרכים שלהם.. ולתרגם את זה לתכנון מושלם של בית החלומות!`,
  },
  {
    name: 'משפחת בקר',
    message: `בנית לנו בית לתפארת. היי לנו המון אילוצים וידעת בחוכמתך ובסינכרון רב לתכנן לנו בית בדיוק כפי שרצינו. הצלחת להתאים הכל למידות ולטעם שלנו. הכל היה אצלך כ״כ מדויק תוך הסתכלות על כל פרט: כל קיר, זווית, דלת, חלון וצבע. הנחת כל בעל מקצוע עם השרטוט המדויק שבנית לו וידעת לפתור לנו כל אילוץ בתכנון חלופי ובמקצועיות רבה. היית העוגן שלי בבית הזה ובזכותך היה לי ראש שקט. ידעת שאת יודעת טוב ממני ונתתי לך להחליט בעבורי את רוב ההחלטות ואכן צדקתי שסמכתי עליך. יש לנו בית שאנחנו לא רוצים לצאת ממנו. אנחנו מאוהבים. בזכותך. תודה רבה אשה מוכשרת שכמותך`,
  },
  {
    name: 'משפחת שמעון',
    message: `מהרגע הראשון היה ברור שמדובר בעבודה מקצועית ויסודית. התכנון נעשה מתוך הקשבה אמיתית לצרכים שלנו, הבנה עמוקה של המגבלות והאילוצים, וירידה לפרטים הקטנים ביותר. כל החלטה לוותה בהסבר ברור, חשיבה קדימה ופתרונות חכמים שהתאימו גם לתכנון וגם לביצוע בשטח.
הליווי היה מדויק, אחראי ועם נוכחות מלאה מול כל בעלי המקצוע, מה שנתן לנו שקט נפשי לאורך כל הדרך. הרגשנו שיש מי שמחזיק את הפרויקט, רואה את התמונה הגדולה ולא מפספס אף פרט קטן.
התוצאה היא בית מתוכנן היטב, נעים ונכון לנו כזה שמרגיש טבעי, מאוזן ובעיקר מחובר לאיך שאנחנו חיים באמת.
ממליצים מאוד למי שמחפש תכנון איכותי, חשיבה עמוקה וליווי שאפשר לסמוך עליו`,
  },
  {
    name: 'משפחת אביטל',
    message: `כבר מהפגישה הראשונה הרגשנו שיש על מי לסמוך. התהליך היה נעים, מסודר וברור, עם הרבה הקשבה ויכולת להבין בדיוק מה חשוב לנו גם בדברים שלא תמיד ידענו להגדיר בעצמנו.
הייתה זמינות, ירידה לפרטים ויכולת לפתור דברים תוך כדי תנועה, בצורה עניינית וחכמה. הכל התחבר בסוף לבית שמרגיש נכון לנו, לא מתאמץ
שמחים מאוד על הבחירה, וממליצים למי שמחפש ליווי מקצועי עם גישה אנושית וראש שקט לאורך כל הדרך.`,
  },
  {
    name: 'משפחת ניסים',
    message: `תכננו בית פרטי מאפס, ואחרי שבדקנו ודיברנו עם לא מעט אדריכלים, ושירן הייתה החלטה טובה. התהליך היה ברור ורגוע, עם הקשבה אמיתית לצרכים שלנו וחשיבה נכונה על כל פרט. הרגשנו שיש מי שמוביל את הפרויקט ויודע לקבל החלטות בזמן הנכון. בסוף קיבלנו בית שמתאים לנו באמת ונעים לנו לחיות בו. שמחים מאוד על הבחירה`,
  },
];

export default function Testimonials() {
  const { screenWidth } = useScreenContext();
  const ref = useRef<HTMLDivElement>(null);
  const [totalOriginalContentWidth, setTotalOriginalContentWidth] = useState(0);
  const x = useMotionValue(0);
  const animationRef = useRef<ReturnType<typeof animate> | null>(null);

  const duplicatedTestimonials = [
    ...testimonials,
    ...testimonials,
    testimonials[0],
  ];
  useEffect(() => {
    if (ref.current) {
      let calculatedWidth = 0;
      const originalChildren = Array.from(ref.current.children).slice(
        0,
        testimonials.length,
      ) as HTMLElement[];

      originalChildren.forEach((child) => {
        const itemComputedStyle = window.getComputedStyle(child);
        const itemMarginRight = parseFloat(itemComputedStyle.marginRight) || 0;
        const itemMarginLeft = parseFloat(itemComputedStyle.marginLeft) || 0;
        calculatedWidth += child.offsetWidth + itemMarginLeft + itemMarginRight;
      });

      setTotalOriginalContentWidth(calculatedWidth);
    }
  }, [screenWidth, ref]);

  useEffect(() => {
    if (totalOriginalContentWidth > 0) {
      x.set(totalOriginalContentWidth);
      if (animationRef.current) {
        animationRef.current.stop();
      }
      animationRef.current = animate(x, 0, {
        duration: 20,
        repeat: Infinity,
        ease: 'linear',
        repeatType: 'loop',
      });
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, [totalOriginalContentWidth, x]);

  const handleMouseEnter = () => {
    if (animationRef.current) {
      animationRef.current.stop();
    }
  };

  const handleMouseLeave = () => {
    if (totalOriginalContentWidth > 0) {
      const currentX = x.get();
      animationRef.current = animate(x, 0, {
        duration: 20,
        repeat: Infinity,
        ease: 'linear',
        repeatType: 'loop',
        from: currentX,
      });
    }
  };

  if (totalOriginalContentWidth === 0) {
    return (
      <div className='relative mt-20 flex' ref={ref}>
        {duplicatedTestimonials.map((testimonial, i) => (
          <TestimonialItem key={i} {...testimonial} />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      style={{ x, width: 'fit-content' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className='relative mt-20 flex'
    >
      {duplicatedTestimonials.map((testimonial, i) => (
        <TestimonialItem key={i} {...testimonial} />
      ))}
    </motion.div>
  );
}

interface ITestimonial {
  name: string;
  message: string;
}

const TestimonialItem = ({ name, message }: ITestimonial) => {
  return (
    <div className='relative mr-36 max-w-72 shrink-0 md:mr-64 md:max-w-64 lg:mr-96 lg:max-w-96'>
      <TestimonialsQuote />

      <div className='z-10 flex flex-col'>
        <h3>{name}</h3>
        <p>{message}</p>
        <TestimonialsStars className='mt-auto' />
      </div>
    </div>
  );
};

function TestimonialsStars({ className }: { className?: string }) {
  return (
    <div className={`flex gap-1 ${className}`}>
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          width='24'
          height='23'
          viewBox='0 0 24 23'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M13.4477 0.780967C13.2175 0.30371 12.7311 0 12.1969 0C11.6628 0 11.1807 0.30371 10.9462 0.780967L8.15364 6.52108L1.91714 7.44088C1.39598 7.51898 0.961684 7.88343 0.800994 8.38238C0.640305 8.88133 0.770593 9.43235 1.14409 9.80114L5.66946 14.2743L4.60109 20.5958C4.51423 21.1165 4.73138 21.6458 5.16134 21.9539C5.59129 22.2619 6.16022 22.301 6.62926 22.0536L12.2013 19.0816L17.7733 22.0536C18.2424 22.301 18.8113 22.2662 19.2412 21.9539C19.6712 21.6415 19.8883 21.1165 19.8015 20.5958L18.7288 14.2743L23.2541 9.80114C23.6276 9.43235 23.7623 8.88133 23.5972 8.38238C23.4322 7.88343 23.0023 7.51898 22.4811 7.44088L16.2403 6.52108L13.4477 0.780967Z'
            fill='#FFBF00'
          />
        </svg>
      ))}
    </div>
  );
}

function TestimonialsQuote() {
  return <svg
    className='absolute -right-3 -top-3 z-0 fill-primary/10'
    width='120'
    height='86'
    viewBox='0 0 120 86'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path d='M120 53.75C120 71.5681 105.616 86 87.8571 86H85.7143C80.9732 86 77.1429 82.1569 77.1429 77.4C77.1429 72.6431 80.9732 68.8 85.7143 68.8H87.8571C96.1339 68.8 102.857 62.0544 102.857 53.75V51.6H85.7143C76.2589 51.6 68.5714 43.8869 68.5714 34.4V17.2C68.5714 7.71313 76.2589 0 85.7143 0H102.857C112.312 0 120 7.71313 120 17.2V25.8V34.4V53.75ZM51.4286 53.75C51.4286 71.5681 37.0446 86 19.2857 86H17.1429C12.4018 86 8.57143 82.1569 8.57143 77.4C8.57143 72.6431 12.4018 68.8 17.1429 68.8H19.2857C27.5625 68.8 34.2857 62.0544 34.2857 53.75V51.6H17.1429C7.6875 51.6 0 43.8869 0 34.4V17.2C0 7.71313 7.6875 0 17.1429 0H34.2857C43.7411 0 51.4286 7.71313 51.4286 17.2V25.8V34.4V53.75Z' />
  </svg>
}