import { Link } from 'react-router-dom';
import { IProject } from '@/data/shiran.projects';
import ImageScaleHover from '@/components/ImageScaleHover';
import { CategoryLabel } from '@/components/CategoryLabel';

interface IProjectProps {
  categoriesObj: any;
  project: IProject;
  i: number;
}

const Project = ({ categoriesObj, project, i }: IProjectProps) => {
  return (
    <div
      className={`flex flex-col gap-5 lg:flex-row ${i % 2 === 0 ? '' : 'lg:flex-row-reverse'}`}
    >
      <Link
        to={`/projects/${project._id}`}
        state={{ project, categoriesObj, other: 'other' }}
      >
        <ImageScaleHover
          containerClassName='rounded-xl w-full lg:w-auto lg:h-[500px] shadow-[0_0_5px_0_rgba(0,0,0,0.2)] grow'
          src={project.mainImage}
        />
      </Link>
      <div className='my-1 px-2 lg:w-1/3'>
        <h4 className='subheading font-semibold'>{project.title}</h4>
        <div className='my-1 flex flex-wrap gap-1'>
          {project.categories?.map((catCode) => (
            <CategoryLabel key={catCode} label={categoriesObj[catCode]} />
          ))}
        </div>
        <p>
          <strong>סטטוס: </strong>
          {project.isCompleted ? 'הושלם' : 'בתהליך'}
        </p>
        <p className='break-words'>
          <strong>תיאור הפרוייקט: </strong>
          {project.description} <br />
          <Link
            to={`/projects/${project._id}`}
            state={{ project, categoriesObj }}
            className='font-semibold underline'
          >
            עוד על הפרויקט
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Project;
