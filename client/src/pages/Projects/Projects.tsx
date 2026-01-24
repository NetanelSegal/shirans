import { IProject, projects as projectsData } from '@/data/shiran.projects';
import Project from './components/Project';
import EnterAnimation from '@/components/animations/EnterAnimation';
import { usePageMetadata } from '@/hooks/usePageMetadata';

export default function Projects() {
  usePageMetadata({
    title: 'פרויקטים - שירן גלעד אדריכלות ועיצוב פנים',
    description: 'גלריית פרויקטים מרשימה של בתים פרטיים, דירות יוקרהנטהאוזים. כל פרויקט מתוכנן בקפידה בהתאמה אישית ללקוח.',
    ogImage: projectsData.length > 0 && typeof projectsData[0].mainImage === 'object' 
      ? projectsData[0].mainImage.desktop 
      : '/assets/shiranImage-28AXxNS6.jpeg',
  });
  return (
    <>
      <div className='py-10 text-center'>
        <h1 className='heading mb-4 font-bold'>פרוייקטים</h1>
        <p className='paragraph px-[10vw] font-semibold'>
          "אדריכלות היא תהליך שמחבר בין חזון אישי לתכנון מקצועי, במטרה ליצור
          חללים יפים ומותאמים בדיוק לצרכים שלכם"
        </p>
      </div>
      {projectsData.map((e: IProject, i) => (
        <EnterAnimation key={e._id}>
          <div className={`${i !== 0 ? 'py-5 lg:py-10' : 'py-5 lg:pb-10'}`}>
            <Project project={e} i={i} />
          </div>
        </EnterAnimation>
      ))}
    </>
  );
}
