import { CategoryLabel } from '@/components/CategoryLabel';
import FavoriteProjects from '@/components/FavoriteProjects';
import ImageScaleHover from '@/components/ui/ImageScaleHover';
import { Navigate, useParams, useNavigate } from 'react-router-dom';
import ProjectImagePlanShowcase from './components/ProjectImagePlanShowcase';
import { Fragment } from 'react';
import EnterAnimation from '@/components/animations/EnterAnimation';
import PageSeo from '@/components/Seo/PageSeo';
import { ErrorState } from '@/components/DataState';
import { ProjectDetailSkeleton } from '@/components/skeletons';
import { useCategoriesMap } from '@/hooks/useCategories';
import { useProject } from '@/hooks/useProject';
import {
  getMainImageUrl,
  getMediaUrlsByType,
  optimizeCloudinaryImageUrl,
} from '@shirans/shared';

export default function Project() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { categoriesMap } = useCategoriesMap();
  const {
    project,
    projectFromList,
    projectsLoading,
    directLoading,
    directErrorMessage,
  } = useProject(id);

  if (projectsLoading && !projectFromList) {
    return <ProjectDetailSkeleton />;
  }

  if (directLoading) {
    return <ProjectDetailSkeleton />;
  }

  if (directErrorMessage) {
    return (
      <ErrorState
        message={directErrorMessage}
        onRetry={() => navigate('/projects')}
        retryLabel="חזרה לפרויקטים"
      />
    );
  }

  if (!project) return <Navigate to='/projects' />;

  const mainImageUrl = optimizeCloudinaryImageUrl(
    getMainImageUrl(project.media),
    1200,
  );
  const planUrls = getMediaUrlsByType(project.media, 'PLAN');
  const videoUrls = getMediaUrlsByType(project.media, 'VIDEO');
  const galleryUrls = getMediaUrlsByType(project.media, 'IMAGE');

  const ogImage = mainImageUrl;
  const description = project.description.split('\n')[0].substring(0, 160) + '...';
  const title = `${project.title} - שירן גלעד אדריכלות ועיצוב פנים`;

  return (
    <>
      <PageSeo
        title={title}
        description={description}
        path={`/projects/${project.id}`}
        image={ogImage}
      />
      {/* main image */}
      <EnterAnimation translateY={false} duration={0.8}>
        <div className='breakout-x-padding relative mb-10'>
          <h1 className='px-page-all heading absolute bottom-5 z-20 font-semibold text-white drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]'>
            {project.title}
          </h1>
          <ImageScaleHover
            containerClassName='w-full h-[75vh] shadow-[0_0_5px_0_rgba(0,0,0,0.2)] grow'
            src={mainImageUrl}
            alt={project.title}
            width={1600}
            height={900}
          />
        </div>
      </EnterAnimation>

      {/* info table */}
      <EnterAnimation delay={0.2}>
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
                          label={categoriesMap[catCode]}
                          key={categoriesMap[catCode]}
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
      </EnterAnimation>

      {/* תוכניות */}
      {planUrls.length > 0 && (
        <EnterAnimation delay={0.1}>
          <div className='py-10'>
            <h3 className='subheading mb-5'>תוכניות</h3>
            <ProjectImagePlanShowcase
              imageClassname='shrink-0 overflow-hidden sm:basis-[calc(50%-4px)]'
              containerClassname='flex w-full flex-wrap justify-start gap-2 md:flex-row md:overflow-x-auto justify-between'
              arr={planUrls}
            />
          </div>
        </EnterAnimation>
      )}

      {/* סרטונים */}
      {videoUrls.length > 0 && (
        <EnterAnimation delay={0.1}>
          <div className='py-10'>
            <h3 className='subheading mb-5'>סרטונים</h3>
            <div className='flex w-full flex-wrap justify-center gap-2 sm:flex-row'>
              {videoUrls.map((src, i) => (
                <EnterAnimation key={src} delay={i * 0.1} translateY={false}>
                  <iframe
                    src={`${src}?autoplay=1&mute=1&controls=0&loop=1`}
                    className='aspect-[9/16] w-72 rounded-2xl border-2 border-secondary shadow-[0_0_5px_0_rgba(0,0,0,0.2)]'
                    title='YouTube video player'
                  ></iframe>
                </EnterAnimation>
              ))}
            </div>
          </div>
        </EnterAnimation>
      )}

      {/* תמונות */}
      <EnterAnimation delay={0.1}>
        <div className='py-10'>
          <h3 className='subheading mb-5'>תמונות</h3>
          <ProjectImagePlanShowcase
            imageClassname='shrink-0 overflow-hidden sm:basis-[calc(50%-4px)]'
            containerClassname='flex w-full flex-wrap justify-start gap-2 md:flex-row md:overflow-x-auto justify-between'
            arr={galleryUrls}
          />
        </div>
      </EnterAnimation>

      <div className='py-section-all'>
        <FavoriteProjects />
      </div>
    </>
  );
}
