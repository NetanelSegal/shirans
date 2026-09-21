import { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { SiteImage } from '@/constants/siteImages';
import { Photo } from '../Photo';
import { Container } from '../Section';
import { Rule } from '../SectionHeading';

interface PageHeroProps {
  /** One of the site's photos, or a URL (a project's own image). */
  image: SiteImage | string;
  title: ReactNode;
  subtitle?: ReactNode;
  /**
   * The short vertical tagline set against a hairline at the far edge
   * ("בתים / שמחשבים / נכון…"). One word or phrase per line.
   */
  tagline?: string[];
  /** Where the photo's subject sits, so the crop keeps it. */
  focus?: string;
  size?: 'page' | 'tall';
  children?: ReactNode;
  titleId?: string;
}

/**
 * The photo header every inner page opens with. It sits under the fixed
 * navbar (which is transparent over it), and a navy wash from the text side
 * keeps the cream type readable on any photo.
 */
export function PageHero({
  image,
  title,
  subtitle,
  tagline,
  focus = 'center',
  size = 'page',
  children,
  titleId,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        'relative isolate flex items-end overflow-hidden bg-primary-deep text-on-dark',
        size === 'tall' ? 'min-h-[88svh]' : 'min-h-[22rem] md:min-h-[26rem] lg:min-h-[30rem]',
      )}
      aria-labelledby={titleId}
    >
      {typeof image === 'string' ? (
        <img
          src={image}
          alt=''
          fetchPriority='high'
          className='absolute inset-0 -z-20 size-full object-cover'
          style={{ objectPosition: focus }}
        />
      ) : (
        <Photo
          image={image}
          priority
          className='absolute inset-0 -z-20 size-full'
          style={{ objectPosition: focus }}
        />
      )}
      {/* Navy wash: strongest behind the text (start side) and along the top
          under the navbar, clearing toward the far side of the photo. */}
      <div
        aria-hidden
        className='absolute inset-0 -z-10 bg-gradient-to-l from-primary-deep/85 via-primary-deep/45 to-primary-deep/35'
      />
      <div
        aria-hidden
        className='absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-primary-deep/70 to-transparent'
      />

      <Container className='flex items-end justify-between gap-10 pb-12 pt-[calc(var(--nav-height)+3rem)] md:pb-16'>
        <div className='flex max-w-2xl flex-col gap-4'>
          <h1 id={titleId} className='text-h1 text-balance text-on-dark'>
            {title}
          </h1>
          {subtitle && <p className='max-w-measure text-lead text-on-dark/85'>{subtitle}</p>}
          {children}
        </div>

        {tagline && (
          <p className='hidden items-stretch gap-4 self-center text-small leading-snug text-on-dark/85 md:flex'>
            <Rule className='h-auto w-px bg-on-dark/50' />
            <span className='flex flex-col'>
              {tagline.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </span>
          </p>
        )}
      </Container>
    </section>
  );
}
