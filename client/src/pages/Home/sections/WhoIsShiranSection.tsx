import { useNavigate } from 'react-router-dom';
import WhoIsShiranImage from '../components/B_WhoIsShiranImage';
import EnterAnimation from '@/components/animations/EnterAnimation';
import Button from '@/components/ui/Button';

export default function WhoIsShiranSection() {
  const nav = useNavigate();
  return (
    <section
      aria-labelledby='who-is-shiran-heading'
      className='py-section-all flex w-full flex-col items-end justify-center md:flex-row'
    >
      {/* image container */}
      <div className='basis-1/2 self-center'>
        <EnterAnimation delay={0.1} translateY={false}>
          <WhoIsShiranImage />
        </EnterAnimation>
      </div>
      {/* text container */}
      <div className='flex basis-1/2 flex-col gap-2 p-5'>
        <EnterAnimation delay={0.2}>
          <h2 id='who-is-shiran-heading' className='heading font-semibold'>
            שירן גלעד
          </h2>
          <p className='paragraph'>
            עוסקת באדריכלות ועיצוב פנים משנת 2015. <br />
            מתמחה בתכנון בתים פרטיים, דירות יוקרה, ופנטהאוזים. המטרה שלי היא לתכנן
            עבורכם את הבית שתמיד חלמתם עליו, עם דגש על הפרטים הקטנים ביותר, שילוב
            בין חללים מדוייקים המתאימים לצרכים שלכם עם אסטטיקה עיצובית ופרקטיקה.
          </p>
          <div className='mt-2 flex flex-wrap gap-2'>
            <Button variant='primary' onClick={() => nav('/projects')}>
              פרוייקטים
            </Button>
            <Button variant='secondary' onClick={() => nav('/about')}>
              אודות
            </Button>
          </div>
        </EnterAnimation>
      </div>
    </section>
  );
}
