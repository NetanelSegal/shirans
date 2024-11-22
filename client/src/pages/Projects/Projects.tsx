import { IProject, projects as projectsData } from '@/data/shiran.projects';
import { categories as categoriesData } from '@/data/shiran.categories';
import Project from './components/Project';

const categoriesObj = categoriesData.reduce(
  (acc: Record<string, string>, e) => {
    acc[e.urlCode] = e.title;
    return acc;
  },
  {},
);

export default function Projects() {
  return (
    <>
      <h1 className='heading py-10 text-center font-bold'>פרוייקטים</h1>
      {projectsData.map((e: IProject, i) => (
        <div key={e._id} className={`${i !== 0 ? 'py-20' : 'pb-20'}`}>
          <Project
            categoriesObj={categoriesObj}
            project={e}
            i={i}
            key={e._id}
          />
        </div>
      ))}
    </>
  );
}
