import { IProject, projects as projectsData } from '@/data/shiran.projects';
import Project from './components/Project';

export default function Projects() {
  return (
    <>
      <h1 className='heading py-10 text-center font-bold'>פרוייקטים</h1>
      {projectsData.map((e: IProject, i) => (
        <div key={e._id} className={`${i !== 0 ? 'py-20' : 'pb-20'}`}>
          <Project project={e} i={i} key={e._id} />
        </div>
      ))}
    </>
  );
}
