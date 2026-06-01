import { Link, useNavigate } from 'react-router-dom';
import DataCarousel from '../DataCarousel';
import Image from '../ui/Image';
import { useProjects } from '@/hooks/useProjects';
import type { ProjectResponse } from '@shirans/shared';
import {
  getMainImageUrl,
  optimizeCloudinaryImageUrl,
} from '@shirans/shared';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FavoriteProjectsCarouselSkeleton } from '@/components/skeletons';

export default function FavoriteProjects() {
  const nav = useNavigate();
  const { projects, isLoading } = useProjects();
  const data: ProjectResponse[] = projects.filter((p) => p.favourite);

  if (isLoading) {
    return <FavoriteProjectsCarouselSkeleton />;
  }

  if (data.length === 0) return null;

  return (
    <>
      <h2 className='heading mb-4 text-center font-semibold'>
        פרוייקטים נבחרים
      </h2>
      <DataCarousel
        keyProperty='id'
        dataArray={data}
        containerClassname='max-w-[900px] mx-auto'
        singleItem={(project, index) => (
          <div className='relative mb-2 aspect-video size-full overflow-hidden rounded-xl'>
            <Link to={`/projects/${project.id}`} state={{ project: data[index] }}>
              <Image
                key={project.id}
                draggable='false'
                className='size-full object-cover object-center transition-all duration-300 ease-in-out hover:scale-105'
                src={optimizeCloudinaryImageUrl(
                  getMainImageUrl(project.media),
                  900,
                )}
                alt={project.title}
                width={1600}
                height={900}
              />
            </Link>
          </div>
        )}
        carouselNavigation={({ title }, incrementIndex, decrementIndex) => (
          <div className='mt-2 flex flex-wrap gap-1'>
            <div className='flex h-10 grow basis-1/2 items-center rounded-xl bg-primary px-6 text-white'>
              <span className='paragraph'>{title}</span>
            </div>
            <div className='mx-auto flex w-fit items-center gap-2'>
              <button
                type="button"
                className='bg-primary'
                aria-label='פרויקט קודם'
                onClick={decrementIndex}
              >
                <ChevronRight className='size-5' aria-hidden />
              </button>
              <button
                type="button"
                className='bg-primary'
                aria-label='פרויקט הבא'
                onClick={incrementIndex}
              >
                <ChevronLeft className='size-5' aria-hidden />
              </button>
              <button
                className='w-fit shrink text-nowrap bg-secondary text-black'
                onClick={() => nav('/projects')}
              >
                כל הפרוייקטים
              </button>
            </div>
          </div>
        )}
      />
    </>
  );
}
