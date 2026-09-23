import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import type { ArticleSummaryResponse } from '@shirans/shared';

/** The date an article carries in listings: the day it was published. */
export function articleDate(article: Pick<ArticleSummaryResponse, 'publishedAt' | 'createdAt'>) {
  const iso = article.publishedAt ?? article.createdAt;
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('he-IL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * One article in a listing: cover, category, title, the first lines of the
 * excerpt. The whole card is the link, so the target is the card rather than
 * the small "לקריאת המאמר" text.
 */
export function ArticleCard({ article }: { article: ArticleSummaryResponse }) {
  const href = `/blog/${encodeURIComponent(article.slug)}`;
  const date = articleDate(article);

  return (
    <Card as='article' interactive className='group relative flex h-full flex-col rounded-none'>
      <div className='aspect-[16/10] overflow-hidden'>
        <img
          src={article.coverImage}
          alt={article.coverImageAlt ?? ''}
          loading='lazy'
          decoding='async'
          className='size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]'
        />
      </div>
      <div className='flex flex-1 flex-col gap-3 p-6'>
        {article.category && (
          <p className='text-eyebrow font-semibold text-accent-strong'>{article.category}</p>
        )}
        <h3 className='text-h3 text-ink'>
          <Link to={href} className='after:absolute after:inset-0 focus-visible:outline-none'>
            {article.title}
          </Link>
        </h3>
        <p className='line-clamp-3 text-small text-ink-muted'>
          {article.excerpt.replace(/<[^>]+>/g, '')}
        </p>
        <div className='mt-auto flex items-center justify-between gap-3 pt-3 text-small text-ink-subtle'>
          {date && <time dateTime={article.publishedAt ?? article.createdAt}>{date}</time>}
          <span className='inline-flex items-center gap-1 font-semibold text-ink'>
            לקריאה
            <ArrowLeft className='size-4' strokeWidth={1.75} aria-hidden />
          </span>
        </div>
      </div>
    </Card>
  );
}
