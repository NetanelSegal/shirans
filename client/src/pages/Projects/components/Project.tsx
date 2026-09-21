import { Link } from 'react-router-dom';
import type { ProjectResponse } from '@shirans/shared';
import { getMainImageUrl, optimizeCloudinaryImageUrl } from '@shirans/shared';
import Image from '@/components/ui/Image';
import { buttonStyles } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/cn';
import { splitProjectTitle } from '@/utils/projectTitle';

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * One project as a wide row: a text panel and the main photo, the photo fading
 * into the panel. Rows alternate side and tone (cream, then navy).
 */
const Project = ({ project, i }: { project: ProjectResponse; i: number }) => {
  const { name, tagline } = splitProjectTitle(project.title);
  const isDark = i % 2 === 1;
  const href = `/projects/${project.id}`;

  return (
    <article
      className={cn(
        'group relative isolate overflow-hidden rounded-card shadow-card md:flex md:min-h-[22rem]',
        isDark ? 'bg-primary-deep text-on-dark' : 'bg-surface-soft text-ink',
      )}
    >
      <div
        className={cn(
          'relative aspect-[16/10] md:absolute md:inset-y-0 md:aspect-auto md:w-[66%]',
          // Light rows: photo on the far (left) side. Dark rows: the near side.
          isDark ? 'md:start-0' : 'md:end-0',
        )}
      >
        <Image
          className='size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]'
          src={optimizeCloudinaryImageUrl(getMainImageUrl(project.media), 1400)}
          alt=''
          width={1400}
          height={875}
          fadeIn={false}
          loading={i === 0 ? 'eager' : 'lazy'}
        />
        {/* Fade the photo into the panel it sits against. */}
        <div
          aria-hidden
          className={cn(
            'absolute inset-y-0 hidden w-2/5 md:block',
            isDark
              ? 'end-0 bg-gradient-to-r from-primary-deep to-transparent'
              : 'start-0 bg-gradient-to-l from-surface-soft to-transparent',
          )}
        />
      </div>

      <div
        className={cn(
          'relative z-10 flex flex-col items-start justify-center gap-4 p-7 md:w-[42%] md:p-10 lg:p-14',
          isDark && 'md:ms-auto',
        )}
      >
        <p className={cn('flex items-center gap-3 text-small', isDark ? 'text-on-dark/70' : 'text-ink-subtle')}>
          <span dir='ltr'>{pad(i + 1)}</span>
          <span aria-hidden className={cn('h-px w-12', isDark ? 'bg-on-dark/40' : 'bg-accent/60')} />
        </p>
        <h2 className={cn('text-h2 text-balance', isDark ? 'text-on-dark' : 'text-ink')}>{name}</h2>
        {tagline && <p className={cn('text-body', isDark ? 'text-on-dark/75' : 'text-ink-muted')}>{tagline}</p>}
        <Link
          to={href}
          state={{ project }}
          className={cn(
            buttonStyles({ variant: isDark ? 'outline' : 'secondary', size: 'sm' }),
            'mt-2 after:absolute after:inset-0',
          )}
        >
          עוד על הפרויקט
          <ArrowLeft className='size-4' strokeWidth={1.75} aria-hidden />
        </Link>
      </div>
    </article>
  );
};

export default Project;
