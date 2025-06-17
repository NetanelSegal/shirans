import { CategoryLabel } from '@/components/CategoryLabel';
import FavoriteProjects from '@/components/FavoriteProjects';
import ImageScaleHover from '@/components/ui/ImageScaleHover';
import { categoriesCodeToTitleMap } from '@/data/shiran.categories';
import { Navigate, useParams } from 'react-router-dom';
import ProjectImagePlanShowcase from './components/ProjectImagePlanShowcase';
import { useProjects } from '@/contexts/ProjectsContext';
import { Fragment } from 'react/jsx-runtime';

export default function Project() {
  const { id } = useParams<{ id: string }>();
  const { projects } = useProjects();

  const project = projects.find((p) => p._id === id);

  if (!project) return <Navigate to='/projects' />;

  return (
    <>
      {/* main image */}
      <div className='breakout-x-padding relative mb-10'>
        <h3 className='px-page-all heading absolute bottom-5 z-20 font-semibold text-white drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]'>
          {project.title}
        </h3>
        <ImageScaleHover
          containerClassName='w-full h-[75vh] shadow-[0_0_5px_0_rgba(0,0,0,0.2)] grow'
          src={project.mainImage}
        />
      </div>

      {/* info table */}
      <div className='py-10'>
        <div className='flex flex-col items-center'>
          <table className='mb-12 w-full max-w-3xl border-collapse rounded-2xl text-lg'>
            <tbody>
              <tr className='border-b-2 border-secondary'>
                <td className='p-2 text-right'>תגיות: </td>
                <th className='p-2 text-right'>
                  <div className='flex gap-2'>
                    {project.categories.map((catCode) => (
                      <CategoryLabel
                        label={categoriesCodeToTitleMap[catCode]}
                        key={categoriesCodeToTitleMap[catCode]}
                      />
                    ))}
                  </div>
                </th>
              </tr>
              <tr className='border-b-2 border-secondary'>
                <td className='p-2 text-right'>לקוח: </td>
                <th className='p-2 text-right'>{project.client}</th>
              </tr>
              <tr className='border-b-2 border-secondary'>
                <td className='p-2 text-right'>סטטוס:</td>
                <th className='p-2 text-right'>
                  {project.isCompleted ? 'הושלם' : 'בתהליך'}
                </th>
              </tr>
              <tr className='border-b-2 border-secondary'>
                <td className='p-2 text-right'>שטח בנייה:</td>
                <th className='p-2 text-right'>
                  {project.constructionArea} מ"ר
                </th>
              </tr>
              <tr className=''>
                <td className='p-2 text-right'>מיקום:</td>
                <th className='p-2 text-right'> {project.location}</th>
              </tr>
            </tbody>
          </table>
          <p className='w-full break-words md:pl-[30%]'>
            {project.description.split('\n').map((line) => (
              <Fragment key={line}>
                {line}
                <br />
              </Fragment>
            ))}
          </p>
        </div>
      </div>

      {/* תוכניות */}
      {project.plans && (
        <div className='py-10'>
          <h3 className='subheading mb-5'>תוכניות</h3>
          <ProjectImagePlanShowcase
            imageClassname='shrink-0 overflow-hidden sm:basis-[calc(50%-4px)]'
            containerClassname='flex w-full flex-wrap justify-start gap-2 md:flex-row md:overflow-x-auto justify-between'
            arr={project.plans}
          />
        </div>
      )}

      {/* סרטונים */}
      {project.videos && (
        <div className='py-10'>
          <h3 className='subheading mb-5'>סרטונים</h3>
          <div className='flex w-full flex-wrap justify-center gap-2 sm:flex-row'>
            {project.videos.map((src) => (
              <iframe
                key={src}
                src={`${src}?autoplay=1&mute=1&controls=0&loop=1`}
                className='aspect-[9/16] w-72 rounded-2xl border-2 border-secondary shadow-[0_0_5px_0_rgba(0,0,0,0.2)]'
                title='YouTube video player'
              ></iframe>
            ))}
          </div>
        </div>
      )}

      {/* תמונות */}
      <div className='py-10'>
        <h3 className='subheading mb-5'>תמונות</h3>
        <ProjectImagePlanShowcase
          imageClassname='shrink-0 overflow-hidden sm:basis-[calc(50%-4px)]'
          containerClassname='flex w-full flex-wrap justify-start gap-2 md:flex-row md:overflow-x-auto justify-between'
          arr={project.images}
        />
      </div>

      <div className='py-section-all'>
        <FavoriteProjects />
      </div>
    </>
  );
}
