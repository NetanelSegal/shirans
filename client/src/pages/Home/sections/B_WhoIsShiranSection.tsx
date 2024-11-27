import { useNavigate } from 'react-router-dom';
import WhoIsShiranImage from '../components/B_WhoIsShiranImage';

export default function WhoIsShiranSection() {
  const nav = useNavigate();
  return (
    <section
      aria-labelledby='who-is-shiran-heading'
      className='py-section-all flex w-full flex-col items-end md:flex-row'
    >
      {/* image container */}
      <div className='basis-1/2 self-center'>
        <WhoIsShiranImage />
      </div>
      {/* text container */}
      <div className='flex basis-1/2 flex-col gap-2 p-5'>
        <h2 id='who-is-shiran-heading' className='heading font-semibold'>
          שירן גלעד
        </h2>
        <p className='paragraph'>
          עוסקת באדריכלות ועיצוב פנים משנת 2015. <br />
          מתמחה בתכנון בתים פרטיים, דירות יוקרה, ופנטהאוזים. המטרה שלי היא לתכנן
          עבורכם את הבית שתמיד חלמתם עליו, עם דגש על הפרטים הקטנים ביותר, שילוב
          בין חללים מדוייקים המתאימים לצרכים שלכם עם אסטטיקה עיצובית ופרקטיקה.
        </p>
        <div className='flex gap-2'>
          {/* <button className='bg-primary' onClick={() => nav('/about')}>
            עוד עלי
          </button> */}
          <button
            className='bg-secondary text-black'
            onClick={() => nav('/projects')}
          >
            פרוייקטים
          </button>
        </div>
      </div>
    </section>
  );
}
