import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import type { ProjectResponse } from '@shirans/shared';
import { getMainImageUrl, optimizeCloudinaryImageUrl } from '@shirans/shared';
import Image from '@/components/ui/Image';
import { cn } from '@/lib/cn';
import { splitProjectTitle } from '@/utils/projectTitle';

/**
 * A project as a photo with its title laid over a navy wash at the foot —
 * the featured-projects carousel and "more projects" rows.
 */
export function ProjectTile({
  project,
  className,
}: {
  project: ProjectResponse;
  className?: string;
}) {
  const { name, tagline } = splitProjectTitle(project.title);
  return (
    <Link
      to={`/projects/${project.id}`}
      state={{ project }}
      className={cn('group relative block aspect-[4/3] overflow-hidden rounded-card bg-surface-sunken', className)}
    >
      <Image
        draggable='false'
        className='size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]'
        src={optimizeCloudinaryImageUrl(getMainImageUrl(project.media), 1100)}
        alt=''
        width={1100}
        height={825}
      />
      <div
        aria-hidden
        className='absolute inset-0 bg-gradient-to-t from-primary-deep/85 via-primary-deep/20 to-transparent'
      />
      <div className='absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-on-dark md:p-7'>
        <div className='flex flex-col gap-1'>
          <h3 className='text-h3 font-normal text-balance text-on-dark'>{name}</h3>
          {tagline && <p className='text-small text-on-dark/75'>{tagline}</p>}
        </div>
        <span className='inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-on-dark/50 transition-colors duration-300 group-hover:bg-on-dark group-hover:text-ink'>
          <ArrowLeft className='size-4' strokeWidth={1.75} aria-hidden />
        </span>
      </div>
    </Link>
  );
}
