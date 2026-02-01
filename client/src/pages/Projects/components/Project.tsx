import { Link } from 'react-router-dom';
import { IProject } from '@/data/shiran.projects';
import ImageScaleHover from '@/components/ui/ImageScaleHover';
import { CategoryLabel } from '@/components/CategoryLabel';
import { categoriesCodeToTitleMap } from '@/data/shiran.categories';
import { Fragment } from 'react/jsx-runtime';
import EnterAnimation from '@/components/animations/EnterAnimation';
interface IProjectProps {
  project: IProject;
  i: number;
}

const Project = ({ project, i }: IProjectProps) => {
  return (
    <div
      className={`flex flex-col gap-5 lg:flex-row ${i % 2 === 0 ? '' : 'lg:flex-row-reverse'}`}
    >
      <div className='lg:w-2/3'>
        <EnterAnimation delay={i * 0.1} translateY={false}>
          <Link
            to={`/projects/${project._id}`}
            state={{ project, other: 'other' }}
          >
            <ImageScaleHover
              containerClassName='rounded-xl shadow-[0_0_5px_0_rgba(0,0,0,0.2)] grow'
              src={project.mainImage}
            />
          </Link>
        </EnterAnimation>
      </div>
      <div className='my-1 px-2 lg:w-1/3'>
        <EnterAnimation delay={i * 0.1 + 0.1}>
          <h4 className='subheading font-semibold'>{project.title}</h4>
          <div className='my-1 flex flex-wrap gap-1'>
            {project.categories?.map((catCode) => (
              <CategoryLabel
                key={catCode}
                label={categoriesCodeToTitleMap[catCode]}
              />
            ))}
          </div>
          <p>
            <strong>סטטוס: </strong>
            {project.isCompleted ? 'הושלם' : 'בתהליך'}
          </p>
          <p className='break-words'>
            <strong>תיאור הפרוייקט: </strong>
            <br />
            {project.description
              .trim()
              .split('\n')
              .map((line) => (
                <Fragment key={line}>
                  {line}
                  <br />
                </Fragment>
              ))}
            <Link
              to={`/projects/${project._id}`}
              className='font-semibold underline'
            >
              עוד על הפרויקט
            </Link>
          </p>
        </EnterAnimation>
      </div>
    </div>
  );
};

export default Project;
