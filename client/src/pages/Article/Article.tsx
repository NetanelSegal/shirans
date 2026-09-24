import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PageSeo from '@/components/Seo/PageSeo';
import { ArticleCard } from '@/components/Articles/ArticleCard';
import { Faq } from '@/components/ui/Faq';
import { Container, Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ArticleDetailSkeleton } from '@/components/skeletons';
import { BASE_URL } from '@/constants/urls';
import { SITE_NAME } from '@/constants/pageMeta';
import { useArticle, useArticles } from '@/hooks/useArticles';
import { articleDate } from '@/components/Articles/ArticleCard';

const plain = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

export default function Article() {
  const { slug } = useParams<{ slug: string }>();
  const { data: article, isLoading, isError } = useArticle(slug);
  const { data: all = [] } = useArticles();

  const more = useMemo(
    () => all.filter((a) => a.slug !== slug).slice(0, 3),
    [all, slug],
  );

  /**
   * Article + FAQPage + BreadcrumbList, from the article's own data. Google
   * reads these to show the breadcrumb trail and the expandable questions.
   */
  const jsonLd = useMemo(() => {
    if (!article) return null;
    const url = `${BASE_URL}/blog/${encodeURIComponent(article.slug)}`;
    const graph: Record<string, unknown>[] = [
      {
        '@type': 'Article',
        headline: article.title,
        description: article.seoDescription || plain(article.excerpt),
        image: article.coverImage,
        datePublished: article.publishedAt ?? article.createdAt,
        dateModified: article.updatedAt,
        author: { '@type': 'Person', name: 'שירן גלעד' },
        publisher: { '@type': 'Organization', name: SITE_NAME },
        mainEntityOfPage: url,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'עמוד הבית', item: `${BASE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'מרכז הידע', item: `${BASE_URL}/blog` },
          { '@type': 'ListItem', position: 3, name: article.title, item: url },
        ],
      },
    ];
    if (article.faq.length > 0) {
      graph.push({
        '@type': 'FAQPage',
        mainEntity: article.faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      });
    }
    return { '@context': 'https://schema.org', '@graph': graph };
  }, [article]);

  if (isError) return <Navigate to='/blog' replace />;
  if (isLoading || !article) return <ArticleDetailSkeleton />;

  const date = articleDate(article);

  return (
    <>
      <PageSeo
        title={article.seoTitle || `${article.title} | ${SITE_NAME}`}
        description={article.seoDescription || plain(article.excerpt).slice(0, 160)}
        path={`/blog/${encodeURIComponent(article.slug)}`}
        image={article.coverImage}
        imageAlt={article.coverImageAlt ?? article.title}
      />
      {jsonLd && (
        <Helmet>
          <script type='application/ld+json'>{JSON.stringify(jsonLd)}</script>
        </Helmet>
      )}

      <article>
        <Section as='header' spacing='tight' container='narrow' className='pt-[calc(var(--nav-height)+2rem)]'>
          <nav aria-label='מיקום' className='mb-6 text-small text-ink-muted'>
            <Link to='/blog' className='inline-flex items-center gap-2 hover-capable:hover:text-ink'>
              <ArrowLeft className='size-4' strokeWidth={1.75} aria-hidden />
              חזרה למרכז הידע
            </Link>
          </nav>
          {article.category && (
            <p className='mb-3 text-eyebrow font-semibold text-accent-strong'>{article.category}</p>
          )}
          <h1 className='text-h1 text-balance text-ink'>{article.title}</h1>
          <p className='mt-5 max-w-measure text-lead text-ink-muted'>{plain(article.excerpt)}</p>
          <p className='mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-small text-ink-subtle'>
            {date && <time dateTime={article.publishedAt ?? article.createdAt}>{date}</time>}
            <span aria-hidden>·</span>
            <span>זמן קריאה: {article.readingMinutes} דקות</span>
          </p>
        </Section>

        <Container width='narrow'>
          <img
            src={article.coverImage}
            alt={article.coverImageAlt ?? ''}
            className='aspect-[16/9] w-full object-cover shadow-card'
            fetchPriority='high'
          />
        </Container>

        <Section spacing='tight' container='narrow'>
          {/*
            The body is HTML written in the admin editor. The server sanitises
            it on the way in with a strict allow-list, so what reaches here has
            no script, style, iframe or event handler left in it.
          */}
          <div
            className='article-body text-body text-ink-muted'
            dangerouslySetInnerHTML={{ __html: article.body }}
          />
        </Section>

        {article.faq.length > 0 && (
          <Section tone='soft' container='narrow' aria-labelledby='article-faq-heading'>
            <SectionHeading
              id='article-faq-heading'
              title='שאלות נפוצות'
              align='start'
              as='h2'
              className='mb-8'
            />
            <Faq items={article.faq} />
          </Section>
        )}
      </article>

      {more.length > 0 && (
        <Section tone='sunken' aria-labelledby='more-articles-heading'>
          <SectionHeading
            id='more-articles-heading'
            title='מאמרים נוספים'
            align='start'
            as='h2'
            action={
              <Link to='/blog' className='inline-flex items-center gap-1.5 text-small font-semibold text-ink hover-capable:hover:underline'>
                לכל המאמרים
                <ArrowLeft className='size-4' strokeWidth={1.75} aria-hidden />
              </Link>
            }
            className='mb-10'
          />
          <ul className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {more.map((item) => (
              <li key={item.id}>
                <ArticleCard article={item} />
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  );
}
