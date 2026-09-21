import { useProjects } from '@/hooks/useProjects';
import { ButtonLink } from '@/components/ui/Button';
import { Carousel } from '@/components/ui/Carousel';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { FavoriteProjectsCarouselSkeleton } from '@/components/skeletons';
import { ProjectTile } from './ProjectTile';

/** The projects Shiran marked as favourites, two across on desktop. */
export default function FavoriteProjects({
  title = 'פרויקטים נבחרים',
  excludeId,
}: {
  title?: string;
  /** Leave out the project being viewed. */
  excludeId?: string;
}) {
  const { projects, isLoading } = useProjects();
  const favourites = projects.filter((p) => p.favourite && p.id !== excludeId);

  if (isLoading) return <FavoriteProjectsCarouselSkeleton />;
  if (favourites.length === 0) return null;

  return (
    <div className='flex flex-col gap-8 md:gap-10'>
      <SectionHeading
        title={title}
        align='start'
        action={
          <ButtonLink to='/projects' variant='text' arrow>
            לכל הפרויקטים
          </ButtonLink>
        }
      />
      <Carousel
        label={title}
        items={favourites}
        getKey={(project) => project.id}
        itemClassName='basis-[85%] md:basis-[calc(50%-0.75rem)]'
        renderItem={(project) => <ProjectTile project={project} />}
      />
    </div>
  );
}
