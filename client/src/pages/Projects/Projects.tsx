import { useProjects } from '@/hooks/useProjects';
import type { ProjectResponse } from '@shirans/shared';
import { getMainImageUrl, optimizeCloudinaryImageUrl } from '@shirans/shared';
import Project from './components/Project';
import EnterAnimation from '@/components/animations/EnterAnimation';
import PageSeo from '@/components/Seo/PageSeo';
import { DEFAULT_OG_IMAGE } from '@/constants/seo';
import { DataStateGuard } from '@/components/DataState';
import { ProjectListSkeleton } from '@/components/skeletons';

const PROJECTS_TITLE = 'פרויקטים - שירן גלעד אדריכלות ועיצוב פנים';
const PROJECTS_DESCRIPTION =
  'גלריית פרויקטים מרשימה של בתים פרטיים, דירות יוקרה, ופנטהאוזים. כל פרויקט מתוכנן בקפידה בהתאמה אישית ללקוח.';

export default function Projects() {
  const { projects, isLoading, error, retry } = useProjects();

  const ogImage =
    projects.length > 0
      ? optimizeCloudinaryImageUrl(
          getMainImageUrl(projects[0]!.media),
          1200,
        )
      : DEFAULT_OG_IMAGE;

  return (
    <>
      <PageSeo
        title={PROJECTS_TITLE}
        description={PROJECTS_DESCRIPTION}
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
