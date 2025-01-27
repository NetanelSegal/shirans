import { IProject, projects as projectsData } from '@/data/shiran.projects';
import Project from './components/Project';
import EnterAnimation from '@/components/animations/EnterAnimation';

export default function Projects() {
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
          <div className={`${i !== 0 ? 'py-20' : 'pb-20'}`}>
            <Project project={e} i={i} />
          </div>
        </EnterAnimation>
      ))}
    </>
  );
}
