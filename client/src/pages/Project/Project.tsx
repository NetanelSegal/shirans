import { CategoryLabel } from '@/components/CategoryLabel';
import FavoriteProjects from '@/components/FavoriteProjects';
import ImageScaleHover from '@/components/ui/ImageScaleHover';
import { categoriesCodeToTitleMap } from '@/data/shiran.categories';
import { Navigate, useParams } from 'react-router-dom';
import ProjectImagePlanShowcase from './components/ProjectImagePlanShowcase';
import { useProjects } from '@/contexts/ProjectsContext';
import { Fragment } from 'react/jsx-runtime';
import EnterAnimation from '@/components/animations/EnterAnimation';
import { Helmet } from 'react-helmet-async';
import type { ResponsiveImage } from '@/components/ui/Image';
import { BASE_URL } from '@/constants/urls';

export default function Project() {
  const { id } = useParams<{ id: string }>();
  const { projects } = useProjects();

  const project = projects.find((p) => p._id === id);

  if (!project) return <Navigate to='/projects' />;

  // Get image URL for metadata
  const getImageUrl = (img: string | ResponsiveImage): string => {
    if (typeof img === 'string') {
      return img.startsWith('http') ? img : `${BASE_URL}/assets/${img}`;
    }
    return img.desktop.startsWith('http') ? img.desktop : `${BASE_URL}/assets/${img.desktop}`;
  };

  const ogImage = getImageUrl(project.mainImage);
  const ogUrl = `${BASE_URL}/projects/${project._id}`;
  const description = project.description.split('\n')[0].substring(0, 160) + '...';
  const title = `${project.title} - שירן גלעד אדריכלות ועיצוב פנים`;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={ogUrl} />
        <meta property="og:image" content={ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>
      {/* main image */}
      <EnterAnimation translateY={false} duration={0.8}>
        <div className='breakout-x-padding relative mb-10'>
          <h3 className='px-page-all heading absolute bottom-5 z-20 font-semibold text-white drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]'>
            {project.title}
          </h3>
          <ImageScaleHover
            containerClassName='w-full h-[75vh] shadow-[0_0_5px_0_rgba(0,0,0,0.2)] grow'
            src={project.mainImage}
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
      </EnterAnimation>

      {/* תוכניות */}
      {project.plans && (
        <EnterAnimation delay={0.1}>
          <div className='py-10'>
            <h3 className='subheading mb-5'>תוכניות</h3>
            <ProjectImagePlanShowcase
              imageClassname='shrink-0 overflow-hidden sm:basis-[calc(50%-4px)]'
              containerClassname='flex w-full flex-wrap justify-start gap-2 md:flex-row md:overflow-x-auto justify-between'
              arr={project.plans}
            />
          </div>
        </EnterAnimation>
      )}

      {/* סרטונים */}
      {project.videos && (
        <EnterAnimation delay={0.1}>
          <div className='py-10'>
            <h3 className='subheading mb-5'>סרטונים</h3>
            <div className='flex w-full flex-wrap justify-center gap-2 sm:flex-row'>
              {project.videos.map((src, i) => (
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
            arr={project.images}
          />
        </div>
      </EnterAnimation>

      <div className='py-section-all'>
        <FavoriteProjects />
      </div>
    </>
  );
}
