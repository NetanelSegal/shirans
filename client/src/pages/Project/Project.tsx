import FavoriteProjects from '@/components/FavoriteProjects';
import { PageHero } from '@/components/ui/PageHero';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { splitProjectTitle } from '@/utils/projectTitle';
import { Navigate, useParams, useNavigate } from 'react-router-dom';
import ProjectImagePlanShowcase from './components/ProjectImagePlanShowcase';
import PageSeo from '@/components/Seo/PageSeo';
import { ErrorState } from '@/components/DataState';
import { ProjectDetailSkeleton } from '@/components/skeletons';
import { useCategoriesMap } from '@/hooks/useCategories';
import { useProject } from '@/hooks/useProject';
import {
  getMainImageUrl,
  getMediaUrlsByType,
  cloudinaryShareImageUrl,
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
    2000,
  );
  const planUrls = getMediaUrlsByType(project.media, 'PLAN');
  const videoUrls = getMediaUrlsByType(project.media, 'VIDEO');
  const galleryUrls = getMediaUrlsByType(project.media, 'IMAGE');

  // Shaped for a link preview, not for the page: 1200x630 JPEG.
  const ogImage = cloudinaryShareImageUrl(getMainImageUrl(project.media));
  const description = project.description.split('\n')[0].substring(0, 160) + '...';
  const title = `${project.title} - שירן גלעד אדריכלות ועיצוב פנים`;

  const { name, tagline } = splitProjectTitle(project.title);
  const facts = [
    { label: 'לקוח', value: project.client },
    { label: 'מיקום', value: project.location },
    { label: 'שטח בנייה', value: project.constructionArea ? `${project.constructionArea} מ"ר` : null },
    { label: 'סטטוס', value: project.isCompleted ? 'הושלם' : 'בתהליך' },
  ].filter((fact) => fact.value);

  return (
    <>
      <PageSeo title={title} description={description} path={`/projects/${project.id}`} image={ogImage} />

      <PageHero titleId='project-title' image={mainImageUrl} size='tall' title={name} subtitle={tagline}>
        {project.categories.length > 0 && (
          <ul className='mt-2 flex flex-wrap gap-2'>
            {project.categories.map((code) => (
              <li
                key={code}
                className='rounded-full border border-on-dark/40 px-3 py-1 text-small text-on-dark/90'
              >
                {categoriesMap[code]}
              </li>
            ))}
          </ul>
        )}
      </PageHero>

      <Section containerClassName='grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-20'>
        <dl className='grid grid-cols-2 gap-px self-start overflow-hidden rounded-card border border-line/70 bg-line/70 lg:grid-cols-1'>
          {facts.map(({ label, value }) => (
            <div key={label} className='flex flex-col gap-1 bg-surface-soft px-5 py-4'>
              <dt className='text-small text-ink-subtle'>{label}</dt>
              <dd className='text-lead text-ink'>{value}</dd>
            </div>
          ))}
        </dl>
        <div className='flex max-w-2xl flex-col gap-4 text-body text-ink-muted'>
          {project.description
            .split('\n')
            .filter((line) => line.trim())
            .map((line, index) => (
              <p key={index} className={index === 0 ? 'text-lead text-ink' : undefined}>
                {line}
              </p>
            ))}
        </div>
      </Section>

      {planUrls.length > 0 && (
        <Section tone='soft' spacing='tight' aria-labelledby='plans-heading'>
          <SectionHeading id='plans-heading' title='תוכניות' align='start' className='mb-8' />
          <ProjectImagePlanShowcase
            imageClassname='shrink-0 overflow-hidden sm:basis-[calc(50%-0.5rem)]'
            containerClassname='flex w-full flex-wrap justify-between gap-4'
            arr={planUrls}
          />
        </Section>
      )}

      {videoUrls.length > 0 && (
        <Section spacing='tight' aria-labelledby='videos-heading'>
          <SectionHeading id='videos-heading' title='סרטונים' align='start' className='mb-8' />
          <div className='flex flex-wrap justify-center gap-4'>
            {videoUrls.map((src) => (
              <iframe
                key={src}
                src={`${src}?autoplay=1&mute=1&controls=0&loop=1`}
                className='aspect-[9/16] w-72 shadow-card'
                title='סרטון מהפרויקט'
              />
            ))}
          </div>
        </Section>
      )}

      {galleryUrls.length > 0 && (
        <Section spacing='tight' aria-labelledby='gallery-heading'>
          <SectionHeading id='gallery-heading' title='תמונות' align='start' className='mb-8' />
          <ProjectImagePlanShowcase
            imageClassname='shrink-0 overflow-hidden sm:basis-[calc(50%-0.5rem)]'
            containerClassname='flex w-full flex-wrap justify-between gap-4'
            arr={galleryUrls}
          />
        </Section>
      )}

      <Section tone='soft'>
        <FavoriteProjects title='פרויקטים נוספים' excludeId={project.id} />
      </Section>
    </>
  );
}
