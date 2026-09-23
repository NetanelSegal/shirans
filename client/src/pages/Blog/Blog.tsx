import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PageSeo from '@/components/Seo/PageSeo';
import EnterAnimation from '@/components/animations/EnterAnimation';
import { ArticleCard } from '@/components/Articles/ArticleCard';
import Button from '@/components/ui/Button';
import { PageHero } from '@/components/ui/PageHero';
import { Photo } from '@/components/ui/Photo';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ArticleListSkeleton } from '@/components/skeletons';
import { getPageMeta } from '@/constants/pageMeta';
import { SITE_IMAGES } from '@/constants/siteImages';
import { useArticles } from '@/hooks/useArticles';
import { cn } from '@/lib/cn';

const PAGE_META = getPageMeta('/blog');
const ALL = 'הכול';

export default function Blog() {
  const { data: articles = [], isLoading } = useArticles();
  const [category, setCategory] = useState(ALL);

  /** Only categories that actually have an article behind them. */
  const categories = useMemo(
    () => [ALL, ...new Set(articles.map((a) => a.category).filter((c): c is string => !!c))],
    [articles],
  );

  const visible = useMemo(
    () => (category === ALL ? articles : articles.filter((a) => a.category === category)),
    [articles, category],
  );

  const [lead, ...rest] = visible;

  return (
    <>
      <PageSeo title={PAGE_META.title} description={PAGE_META.description} path='/blog' />
      <PageHero
        titleId='blog-hero-title'
        image={SITE_IMAGES.servicesHero}
        title='תכנון, בנייה ועיצוב — כל מה שכדאי לדעת'
        subtitle='מדריכים ומאמרים על תכנון בית פרטי, בנייה, תקציב, עיצוב פנים ורישוי.'
        tagline={['תכנון', 'אנשים', 'בתים', 'בתים טובים יותר']}
      />

      <Section aria-label='מאמרים'>
        {isLoading ? (
          <ArticleListSkeleton />
        ) : articles.length === 0 ? (
          <p className='text-lead text-ink-muted'>המאמרים הראשונים בדרך. חזרו לבקר בקרוב.</p>
        ) : (
          <div className='flex flex-col gap-10 md:gap-14'>
            {categories.length > 2 && (
              <ul className='flex flex-wrap gap-2'>
                {categories.map((name) => (
                  <li key={name}>
                    <Button
                      variant={name === category ? 'primary' : 'quiet'}
                      size='sm'
                      onClick={() => setCategory(name)}
                      aria-pressed={name === category}
                    >
                      {name}
                    </Button>
                  </li>
                ))}
              </ul>
            )}

            {/* The newest article, given the room the design gives it. */}
            {lead && (
              <EnterAnimation>
                <article className='grid items-center gap-8 bg-surface-soft shadow-card md:grid-cols-2 md:gap-0'>
                  <Link to={`/blog/${encodeURIComponent(lead.slug)}`} className='group block overflow-hidden'>
                    <img
                      src={lead.coverImage}
                      alt={lead.coverImageAlt ?? ''}
                      className='aspect-[4/3] size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]'
                    />
                  </Link>
                  <div className='flex flex-col items-start gap-4 p-7 md:p-12'>
                    <p className='text-eyebrow font-semibold text-accent-strong'>מאמר מוביל</p>
                    <h2 className='text-h2 text-ink'>
                      <Link to={`/blog/${encodeURIComponent(lead.slug)}`} className='hover-capable:hover:underline'>
                        {lead.title}
                      </Link>
                    </h2>
                    <p className='text-lead text-ink-muted'>{lead.excerpt.replace(/<[^>]+>/g, '')}</p>
                    <Link
                      to={`/blog/${encodeURIComponent(lead.slug)}`}
                      className='mt-2 inline-flex items-center gap-2 text-small font-semibold text-ink hover-capable:hover:underline'
                    >
                      לקריאת המאמר
                      <ArrowLeft className='size-4' strokeWidth={1.75} aria-hidden />
                    </Link>
                  </div>
                </article>
              </EnterAnimation>
            )}

            {rest.length > 0 && (
              <EnterAnimation>
                <ul className={cn('grid gap-6 sm:grid-cols-2 lg:grid-cols-3')}>
                  {rest.map((article) => (
                    <li key={article.id}>
                      <ArticleCard article={article} />
                    </li>
                  ))}
                </ul>
              </EnterAnimation>
            )}

            {visible.length === 0 && (
              <p className='text-body text-ink-muted'>אין מאמרים בקטגוריה הזו עדיין.</p>
            )}
          </div>
        )}
      </Section>

      <Section tone='sunken' aria-label='על שירן' spacing='tight'>
        <div className='grid items-center gap-8 md:grid-cols-[1fr_2fr] md:gap-12'>
          <Photo
            image={SITE_IMAGES.shiranPortrait}
            sizes='(min-width: 768px) 30vw, 100vw'
            className='aspect-[4/5] w-full shadow-card'
          />
          <div className='flex flex-col gap-4'>
            <SectionHeading title='נעים להכיר' align='start' as='h2' />
            <p className='max-w-measure text-body text-ink-muted'>
              אני שירן גלעד, אדריכלית ומעצבת פנים. כאן אני כותבת על מה שכדאי לדעת לפני
              שמתכננים, בונים ומעצבים בית — מהתקציב ועד הפרטים הקטנים.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
