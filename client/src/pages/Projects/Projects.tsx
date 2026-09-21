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
      <div className='py-10 text-center'>
        <h1 className='heading mb-4 font-bold'>פרוייקטים</h1>
        <p className='paragraph px-[10vw] font-semibold'>
          "אדריכלות היא תהליך שמחבר בין חזון אישי לתכנון מקצועי, במטרה ליצור
          חללים יפים ומותאמים בדיוק לצרכים שלכם"
        </p>
      </div>
      <DataStateGuard
        data={projects}
        isLoading={isLoading}
        error={error}
        emptyMessage="אין פרויקטים להצגה"
        onRetry={retry}
        loadingFallback={<ProjectListSkeleton count={3} />}
      >
        {(data) =>
          data.map((e: ProjectResponse, i) => (
            <EnterAnimation key={e.id}>
              <div className={`${i !== 0 ? 'py-5 lg:py-10' : 'py-5 lg:pb-10'}`}>
                <Project project={e} i={i} />
              </div>
            </EnterAnimation>
          ))
        }
      </DataStateGuard>
    </>
  );
}
