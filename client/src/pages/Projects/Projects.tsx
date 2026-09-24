import { useProjects } from '@/hooks/useProjects';
import type { ProjectResponse } from '@shirans/shared';
import { cloudinaryShareImageUrl, getMainImageUrl } from '@shirans/shared';
import Project from './components/Project';
import EnterAnimation from '@/components/animations/EnterAnimation';
import PageSeo from '@/components/Seo/PageSeo';
import { DEFAULT_OG_IMAGE } from '@/constants/seo';
import { DataStateGuard } from '@/components/DataState';
import { ProjectListSkeleton } from '@/components/skeletons';
import { getPageMeta } from '@/constants/pageMeta';
import { SITE_IMAGES } from '@/constants/siteImages';
import { PageHero } from '@/components/ui/PageHero';
import { Section } from '@/components/ui/Section';

const PAGE_META = getPageMeta('/projects');

export default function Projects() {
  const { projects, isLoading, error, retry } = useProjects();

  const ogImage =
    projects.length > 0
      ? cloudinaryShareImageUrl(getMainImageUrl(projects[0]!.media))
      : DEFAULT_OG_IMAGE;

  return (
    <>
      <PageSeo
        title={PAGE_META.title}
        description={PAGE_META.description}
        path="/projects"
        image={ogImage}
      />
      <PageHero
        titleId='projects-hero-title'
        image={SITE_IMAGES.projectsHero}
        title='פרויקטים'
        subtitle='אדריכלות היא תהליך שמחבר בין חזון אישי לתכנון מקצועי, במטרה ליצור חללים יפים ומותאמים בדיוק לצרכים שלכם.'
        tagline={['בתים', 'דירות', 'בין אנשים', 'למקומות', 'אמיתיים']}
      />
      <Section spacing='tight'>
        <DataStateGuard
          data={projects}
          isLoading={isLoading}
          error={error}
          emptyMessage='אין פרויקטים להצגה'
          onRetry={retry}
          loadingFallback={<ProjectListSkeleton count={3} />}
        >
          {(data) => (
            <ol className='flex flex-col gap-6 md:gap-8'>
              {data.map((project: ProjectResponse, i) => (
                <li key={project.id}>
                  <EnterAnimation>
                    <Project project={project} i={i} />
                  </EnterAnimation>
                </li>
              ))}
            </ol>
          )}
        </DataStateGuard>
      </Section>
    </>
  );
}
