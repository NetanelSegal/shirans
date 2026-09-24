import { useRef, useState } from 'react';
import { useAdminArticles } from '@/hooks/admin/useAdminArticles';
import { fetchArticleById, uploadArticleImage } from '@/services/admin/articles.service';
import { AdminPageHeader } from '@/components/Admin/AdminPageHeader';
import { DataTable } from '@/components/Admin/DataTable';
import { FormModal } from '@/components/Admin/FormModal';
import { ConfirmDialog } from '@/components/Admin/ConfirmDialog';
import { BulkActionBar } from '@/components/Admin/BulkActionBar';
import { StatusBadge } from '@/components/Admin/StatusBadge';
import { RichTextEditor } from '@/components/Admin/RichTextEditor';
import { DataStateGuard } from '@/components/DataState';
import { transformError } from '@/utils/errorHandler';
import { getClientErrorMessage } from '@/constants/errorMessages';
import { ARTICLE_CATEGORIES } from '@shirans/shared';
import type {
  ArticleSummaryResponse,
  CreateArticleInput,
  ArticleFaqItem,
} from '@shirans/shared';

interface FormState {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  coverImage: string;
  coverImageAlt: string;
  category: string;
  seoTitle: string;
  seoDescription: string;
  faq: ArticleFaqItem[];
  published: boolean;
}

const EMPTY: FormState = {
  title: '',
  slug: '',
  excerpt: '',
  body: '',
  coverImage: '',
  coverImageAlt: '',
  category: '',
  seoTitle: '',
  seoDescription: '',
  faq: [],
  published: false,
};

const field =
  'w-full rounded-card border border-line bg-surface-raised px-3 py-2 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/20';
const labelClass = 'mb-1.5 block text-sm font-medium text-ink';

export default function ArticlesManagement() {
  const {
    articles,
    isLoading,
    error,
    create,
    update,
    delete: deleteArticle,
    updateBulk,
    deleteBulk,
    refresh,
    isMutationPending,
  } = useAdminArticles();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [formError, setFormError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<ArticleSummaryResponse | null>(null);
  const [bulkDeleteIds, setBulkDeleteIds] = useState<string[] | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const coverRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY);
    setFormError(null);
    setModalOpen(true);
  };

  /** The listing has no body or FAQ, so editing fetches the full article. */
  const openEdit = async (row: ArticleSummaryResponse) => {
    setFormError(null);
    try {
      const article = await fetchArticleById(row.id);
      setEditingId(article.id);
      setForm({
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        body: article.body,
        coverImage: article.coverImage,
        coverImageAlt: article.coverImageAlt ?? '',
        category: article.category ?? '',
        seoTitle: article.seoTitle ?? '',
        seoDescription: article.seoDescription ?? '',
        faq: article.faq,
        published: article.published,
      });
      setModalOpen(true);
    } catch (err) {
      setFormError(getClientErrorMessage(transformError(err).errorKey));
    }
  };

  const onCoverPicked = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setUploadingCover(true);
    try {
      const { url } = await uploadArticleImage(file);
      set('coverImage', url);
    } catch (err) {
      setFormError(getClientErrorMessage(transformError(err).errorKey));
    } finally {
      setUploadingCover(false);
    }
  };

  const onSubmit = async () => {
    setFormError(null);
    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim() || undefined,
      excerpt: form.excerpt.trim(),
      body: form.body,
      coverImage: form.coverImage.trim(),
      coverImageAlt: form.coverImageAlt.trim() || undefined,
      category: (form.category || undefined) as CreateArticleInput['category'],
      seoTitle: form.seoTitle.trim() || undefined,
      seoDescription: form.seoDescription.trim() || undefined,
      faq: form.faq.filter((item) => item.question.trim() && item.answer.trim()),
      published: form.published,
    };
    try {
      if (editingId) await update(editingId, payload);
      else await create(payload as CreateArticleInput);
      setModalOpen(false);
    } catch (err) {
      setFormError(getClientErrorMessage(transformError(err).errorKey));
    }
  };

  const runBulk = async (action: () => Promise<unknown>) => {
    setIsBusy(true);
    try {
      await action();
      setSelectedIds([]);
      setBulkDeleteIds(null);
    } finally {
      setIsBusy(false);
    }
  };

  const columns = [
    {
      key: 'title',
      header: 'כותרת',
      render: (row: ArticleSummaryResponse) => (
        <span className='block max-w-sm whitespace-normal font-medium'>{row.title}</span>
      ),
      className: 'max-w-sm !whitespace-normal align-top',
    },
    {
      key: 'slug',
      header: 'כתובת',
      render: (row: ArticleSummaryResponse) => (
        <span dir='ltr' className='block max-w-[16rem] truncate text-xs text-ink-muted'>
          /blog/{row.slug}
        </span>
      ),
    },
    {
      key: 'category',
      header: 'קטגוריה',
      render: (row: ArticleSummaryResponse) => row.category ?? '—',
    },
    {
      key: 'published',
      header: 'סטטוס',
      render: (row: ArticleSummaryResponse) => (
        <StatusBadge
          label={row.published ? 'פורסם' : 'טיוטה'}
          variant={row.published ? 'published' : 'draft'}
        />
      ),
    },
    {
      key: 'publishedAt',
      header: 'תאריך',
      render: (row: ArticleSummaryResponse) =>
        row.publishedAt ? new Date(row.publishedAt).toLocaleDateString('he-IL') : '—',
    },
  ];

  return (
    <div dir='rtl'>
      <AdminPageHeader title='ניהול מאמרים' actionLabel='מאמר חדש' onAction={openCreate} />
      <DataStateGuard
        data={articles}
        isLoading={isLoading}
        error={error}
        emptyMessage='אין מאמרים'
        onRetry={refresh}
        loadingMinHeight='20rem'
      >
        {(data) => (
          <>
            <BulkActionBar
              selectedCount={selectedIds.length}
              onPublish={() => runBulk(() => updateBulk(selectedIds, true))}
              onUnpublish={() => runBulk(() => updateBulk(selectedIds, false))}
              onDelete={() => setBulkDeleteIds(selectedIds)}
              onClearSelection={() => setSelectedIds([])}
              mode='testimonials'
              isBusy={isBusy}
            />
            <DataTable
              columns={columns}
              data={data}
              isLoading={false}
              emptyMessage='אין מאמרים'
              getRowId={(row) => row.id}
              selectable
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
              actions={(row) => (
                <div className='flex flex-wrap items-center gap-2'>
                  {row.published && (
                    <a
                      href={`/blog/${encodeURIComponent(row.slug)}`}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='rounded-card bg-line px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:bg-ink-subtle'
                    >
                      צפייה
                    </a>
                  )}
                  <button
                    type='button'
                    onClick={() => void openEdit(row)}
                    className='rounded-card bg-primary px-3 py-1.5 text-sm font-medium text-on-dark transition-colors hover:bg-primary/90'
                    aria-label={`ערוך ${row.title}`}
                  >
                    עריכה
                  </button>
                  <button
                    type='button'
                    onClick={() => setDeleteTarget(row)}
                    className='rounded-card bg-danger px-3 py-1.5 text-sm font-medium text-on-dark transition-colors hover:bg-danger'
                    aria-label={`מחק ${row.title}`}
                  >
                    מחיקה
                  </button>
                </div>
              )}
            />
          </>
        )}
      </DataStateGuard>

      <FormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'עריכת מאמר' : 'מאמר חדש'}
        onSubmit={(e) => {
          e.preventDefault();
          void onSubmit();
        }}
        submitLabel={editingId ? 'שמירה' : 'יצירה'}
        isSubmitting={isMutationPending}
      >
        <div className='flex flex-col gap-5'>
          {formError && (
            <p className='rounded-card bg-danger-soft p-3 text-sm text-danger' role='alert'>
              {formError}
            </p>
          )}
          <div>
            <label className={labelClass} htmlFor='article-title'>כותרת *</label>
            <input
              id='article-title'
              className={field}
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              maxLength={200}
              required
            />
          </div>

          <div>
            <label className={labelClass} htmlFor='article-slug'>
              כתובת העמוד (ריק = נגזר מהכותרת)
            </label>
            <input
              id='article-slug'
              className={field}
              value={form.slug}
              onChange={(e) => set('slug', e.target.value)}
              placeholder='כמה-עולה-לבנות-בית-פרטי'
              maxLength={120}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor='article-category'>קטגוריה</label>
            <select
              id='article-category'
              className={field}
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
            >
              <option value=''>ללא קטגוריה</option>
              {ARTICLE_CATEGORIES.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor='article-excerpt'>
              תקציר * <span className='font-normal text-ink-muted'>(מופיע בכרטיס ובגוגל)</span>
            </label>
            <textarea
              id='article-excerpt'
              className={field}
              rows={3}
              value={form.excerpt}
              onChange={(e) => set('excerpt', e.target.value)}
              maxLength={600}
              required
            />
          </div>

          <div>
            <span className={labelClass}>תמונת שער *</span>
            <div className='flex items-start gap-3'>
              {form.coverImage && (
                <img
                  src={form.coverImage}
                  alt=''
                  className='size-20 shrink-0 rounded-card border border-line object-cover'
                />
              )}
              <div className='flex-1 space-y-2'>
                <input
                  dir='ltr'
                  className={field}
                  value={form.coverImage}
                  onChange={(e) => set('coverImage', e.target.value)}
                  placeholder='https://… או העלו תמונה'
                />
                <button
                  type='button'
                  onClick={() => coverRef.current?.click()}
                  disabled={uploadingCover}
                  className='rounded-card border border-line px-3 py-1.5 text-sm text-ink transition-colors hover:bg-surface-sunken disabled:opacity-60'
                >
                  {uploadingCover ? 'מעלה…' : 'העלאת תמונה'}
                </button>
                <input
                  ref={coverRef}
                  type='file'
                  accept='image/*'
                  className='hidden'
                  onChange={onCoverPicked}
                />
              </div>
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor='article-alt'>
              תיאור תמונת השער (ALT) <span className='font-normal text-ink-muted'>— מה רואים בתמונה</span>
            </label>
            <input
              id='article-alt'
              className={field}
              value={form.coverImageAlt}
              onChange={(e) => set('coverImageAlt', e.target.value)}
              maxLength={300}
            />
          </div>

          <div>
            <span className={labelClass}>תוכן המאמר *</span>
            <RichTextEditor
              value={form.body}
              onChange={(html) => set('body', html)}
              ariaLabel='תוכן המאמר'
            />
          </div>

          <fieldset className='rounded-card border border-line p-4'>
            <legend className='px-2 text-sm font-medium text-ink'>שאלות נפוצות</legend>
            <p className='mb-3 text-xs text-ink-muted'>
              מופיעות בתחתית המאמר, ונשלחות לגוגל כ־FAQ מובנה.
            </p>
            <div className='flex flex-col gap-3'>
              {form.faq.map((item, index) => (
                <div key={index} className='flex flex-col gap-2 rounded-card bg-surface-soft p-3'>
                  <input
                    className={field}
                    value={item.question}
                    placeholder='שאלה'
                    onChange={(e) =>
                      set('faq', form.faq.map((f, i) => (i === index ? { ...f, question: e.target.value } : f)))
                    }
                  />
                  <textarea
                    className={field}
                    rows={2}
                    value={item.answer}
                    placeholder='תשובה'
                    onChange={(e) =>
                      set('faq', form.faq.map((f, i) => (i === index ? { ...f, answer: e.target.value } : f)))
                    }
                  />
                  <button
                    type='button'
                    onClick={() => set('faq', form.faq.filter((_, i) => i !== index))}
                    className='self-start text-sm text-danger hover:underline'
                  >
                    הסרת שאלה
                  </button>
                </div>
              ))}
              <button
                type='button'
                onClick={() => set('faq', [...form.faq, { question: '', answer: '' }])}
                disabled={form.faq.length >= 20}
                className='self-start rounded-card border border-line px-3 py-1.5 text-sm text-ink transition-colors hover:bg-surface-sunken disabled:opacity-50'
              >
                הוספת שאלה
              </button>
            </div>
          </fieldset>

          <fieldset className='rounded-card border border-line p-4'>
            <legend className='px-2 text-sm font-medium text-ink'>SEO</legend>
            <p className='mb-3 text-xs text-ink-muted'>
              ריק = נלקח מהכותרת ומהתקציר.
            </p>
            <div className='flex flex-col gap-3'>
              <input
                className={field}
                value={form.seoTitle}
                placeholder='Meta Title'
                onChange={(e) => set('seoTitle', e.target.value)}
                maxLength={200}
              />
              <textarea
                className={field}
                rows={2}
                value={form.seoDescription}
                placeholder='Meta Description'
                onChange={(e) => set('seoDescription', e.target.value)}
                maxLength={300}
              />
            </div>
          </fieldset>

          <label className='flex items-center gap-2 text-sm text-ink'>
            <input
              type='checkbox'
              checked={form.published}
              onChange={(e) => set('published', e.target.checked)}
            />
            מפורסם באתר
          </label>
          <p className='-mt-3 text-xs text-ink-muted'>
            פרסום מפעיל בנייה מחדש של האתר, כדי שהשיתוף בוואטסאפ יציג את המאמר. זה לוקח כדקה.
          </p>
        </div>
      </FormModal>

      <ConfirmDialog
        open={!!deleteTarget}
        title='מחיקת מאמר'
        message={`למחוק את "${deleteTarget?.title ?? ''}"? הפעולה אינה הפיכה.`}
        confirmLabel='מחיקה'
        isLoading={isBusy}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() =>
          runBulk(async () => {
            if (deleteTarget) await deleteArticle(deleteTarget.id);
            setDeleteTarget(null);
          })
        }
      />

      <ConfirmDialog
        open={!!bulkDeleteIds}
        title='מחיקת מאמרים'
        message={`למחוק ${bulkDeleteIds?.length ?? 0} מאמרים? הפעולה אינה הפיכה.`}
        confirmLabel='מחיקה'
        isLoading={isBusy}
        onClose={() => setBulkDeleteIds(null)}
        onConfirm={() => runBulk(() => deleteBulk(bulkDeleteIds ?? []))}
      />
    </div>
  );
}
