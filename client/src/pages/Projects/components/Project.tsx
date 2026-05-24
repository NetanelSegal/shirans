import { Link } from 'react-router-dom';
import type { ProjectResponse } from '@shirans/shared';
import ImageScaleHover from '@/components/ui/ImageScaleHover';
import { CategoryLabel } from '@/components/CategoryLabel';
import { useCategoriesMap } from '@/hooks/useCategories';
import EnterAnimation from '@/components/animations/EnterAnimation';

/** Words shown on the projects list; full text is on `/projects/:id`. */
const DESCRIPTION_PREVIEW_MAX_WORDS = 25;

/** Single paragraph for list preview (multi-line source becomes one block). */
function projectDescriptionPreviewText(description: string): string {
  return description
    .trim()
    .split(/\s*\n+\s*/)
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ');
}

function truncateWords(
  text: string,
  maxWords: number
): { preview: string; truncated: boolean } {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) {
    return { preview: text.trim(), truncated: false };
  }
  return {
    preview: `${words.slice(0, maxWords).join(' ')}…`,
    truncated: true,
  };
}

interface IProjectProps {
  project: ProjectResponse;
  i: number;
}

const Project = ({ project, i }: IProjectProps) => {
  const { categoriesMap } = useCategoriesMap();
  const descriptionNormalized = projectDescriptionPreviewText(project.description);
  const { preview: descriptionListPreview, truncated: descriptionTruncated } =
    truncateWords(descriptionNormalized, DESCRIPTION_PREVIEW_MAX_WORDS);

  return (
    <div
      className={`flex flex-col gap-5 lg:flex-row ${i % 2 === 0 ? '' : 'lg:flex-row-reverse'}`}
    >
      <div className='lg:w-2/3'>
        <EnterAnimation delay={i * 0.1} translateY={false}>
          <Link
            to={`/projects/${project.id}`}
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
                label={categoriesMap[catCode]}
              />
            ))}
          </div>
          <p>
            <strong>סטטוס: </strong>
            {project.isCompleted ? 'הושלם' : 'בתהליך'}
          </p>
          <p className='break-words'>
            <strong>תיאור הפרוייקט: </strong>
            <span
              className='mt-1 block text-pretty'
              title={descriptionTruncated ? descriptionNormalized : undefined}
            >
              {descriptionListPreview}
            </span>
            <Link
              to={`/projects/${project.id}`}
              state={{ project, other: 'other' }}
              className='mt-2 inline-block font-semibold underline'
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
