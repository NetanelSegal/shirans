import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAdminTestimonials } from '@/hooks/admin/useAdminTestimonials';
import { AdminPageHeader } from '@/components/Admin/AdminPageHeader';
import { DataTable } from '@/components/Admin/DataTable';
import { FormModal } from '@/components/Admin/FormModal';
import { ConfirmDialog } from '@/components/Admin/ConfirmDialog';
import { StatusBadge } from '@/components/Admin/StatusBadge';
import { ErrorState } from '@/components/DataState';
import type { TestimonialResponse } from '@shirans/shared';
import { createTestimonialSchema } from '@shirans/shared';
type FormData = {
  name: string;
  message: string;
  isPublished?: boolean;
  order: number;
};

const truncate = (str: string, len: number) =>
  str.length <= len ? str : `${str.slice(0, len)}...`;

export default function TestimonialsManagement() {
  const {
    testimonials,
    isLoading,
    error,
    create,
    update,
    delete: deleteTestimonial,
    updateOrder,
    refresh,
  } = useAdminTestimonials();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] =
    useState<TestimonialResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TestimonialResponse | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(createTestimonialSchema) as never,
    defaultValues: {
      name: '',
      message: '',
      isPublished: false,
      order: 0,
    },
  });

  const handleOpenCreate = () => {
    setEditingTestimonial(null);
    setFormError(null);
    form.reset({
      name: '',
      message: '',
      isPublished: false,
      order: testimonials.length,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (t: TestimonialResponse) => {
    setEditingTestimonial(t);
    setFormError(null);
    form.reset({
      name: t.name,
      message: t.message,
      isPublished: t.isPublished,
      order: t.order,
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingTestimonial(null);
    setFormError(null);
  };

  const onSubmit = form.handleSubmit(async (data: FormData) => {
    setFormError(null);
    try {
      if (editingTestimonial) {
        await update(editingTestimonial.id, data);
      } else {
        await create(data);
      }
      handleCloseModal();
    } catch (err) {
      setFormError((err as Error)?.message ?? 'שגיאה בשמירה');
    }
  });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteTestimonial(deleteTarget.id);
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMoveUp = async (t: TestimonialResponse) => {
    const idx = testimonials.findIndex((x) => x.id === t.id);
    if (idx <= 0) return;
    const newOrder = testimonials[idx - 1].order;
    await updateOrder(t.id, newOrder);
  };

  const handleMoveDown = async (t: TestimonialResponse) => {
    const idx = testimonials.findIndex((x) => x.id === t.id);
    if (idx < 0 || idx >= testimonials.length - 1) return;
    const newOrder = testimonials[idx + 1].order;
    await updateOrder(t.id, newOrder);
  };

  const sortedTestimonials = [...testimonials].sort((a, b) => a.order - b.order);

  const columns = [
    {
      key: 'name',
      header: 'שם',
      render: (row: TestimonialResponse) => row.name,
    },
    {
      key: 'message',
      header: 'הודעה',
      render: (row: TestimonialResponse) => truncate(row.message, 50),
      className: 'max-w-[200px]',
    },
    {
      key: 'isPublished',
      header: 'סטטוס',
      render: (row: TestimonialResponse) => (
        <StatusBadge
          label={row.isPublished ? 'פורסם' : 'טיוטה'}
          variant={row.isPublished ? 'published' : 'draft'}
        />
      ),
    },
    {
      key: 'order',
      header: 'סדר',
      render: (row: TestimonialResponse) => row.order,
    },
  ];

  if (error) {
    return (
      <div className="p-6" dir="rtl">
        <ErrorState message={error} onRetry={refresh} />
      </div>
    );
  }

  return (
    <div className="p-6" dir="rtl">
      <AdminPageHeader
        title="ניהול המלצות"
        actionLabel="הוסף המלצה"
        onAction={handleOpenCreate}
      />
      <DataTable
        columns={columns}
        data={sortedTestimonials}
        isLoading={isLoading}
        emptyMessage="אין המלצות"
        getRowId={(row) => row.id}
        actions={(row) => (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleMoveUp(row)}
              className="text-gray-600 hover:text-primary"
              aria-label="העלה"
              disabled={
                sortedTestimonials.findIndex((x) => x.id === row.id) <= 0
              }
            >
              <i className="fa-solid fa-arrow-up" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => handleMoveDown(row)}
              className="text-gray-600 hover:text-primary"
              aria-label="הורד"
              disabled={
                sortedTestimonials.findIndex((x) => x.id === row.id) >=
                sortedTestimonials.length - 1
              }
            >
              <i className="fa-solid fa-arrow-down" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => handleOpenEdit(row)}
              className="text-primary hover:underline"
              aria-label={`ערוך ${row.name}`}
            >
              עריכה
            </button>
            <button
              type="button"
              onClick={() => setDeleteTarget(row)}
              className="text-red-600 hover:underline"
              aria-label={`מחק ${row.name}`}
            >
              מחיקה
            </button>
          </div>
        )}
      />
      <FormModal
        open={modalOpen}
        onClose={handleCloseModal}
        title={editingTestimonial ? 'עריכת המלצה' : 'הוספת המלצה'}
        onSubmit={onSubmit}
        isSubmitting={form.formState.isSubmitting}
      >
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium">
            שם
          </label>
          <input
            id="name"
            type="text"
            {...form.register('name')}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
            aria-invalid={!!form.formState.errors.name}
          />
          {form.formState.errors.name && (
            <p className="mt-1 text-sm text-red-600">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="message" className="mb-1 block text-sm font-medium">
            הודעה
          </label>
          <textarea
            id="message"
            rows={4}
            {...form.register('message')}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
            aria-invalid={!!form.formState.errors.message}
          />
          {form.formState.errors.message && (
            <p className="mt-1 text-sm text-red-600">
              {form.formState.errors.message.message}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <input
            id="isPublished"
            type="checkbox"
            {...form.register('isPublished')}
            className="h-4 w-4 rounded"
          />
          <label htmlFor="isPublished" className="text-sm font-medium">
            פורסם
          </label>
        </div>
        <div>
          <label htmlFor="order" className="mb-1 block text-sm font-medium">
            סדר
          </label>
          <input
            id="order"
            type="number"
            min={0}
            {...form.register('order', { valueAsNumber: true })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
            aria-invalid={!!form.formState.errors.order}
          />
          {form.formState.errors.order && (
            <p className="mt-1 text-sm text-red-600">
              {form.formState.errors.order.message}
            </p>
          )}
        </div>
        {formError && (
          <p className="text-sm text-red-600" role="alert">
            {formError}
          </p>
        )}
      </FormModal>
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="מחיקת המלצה"
        message={
          deleteTarget
            ? `האם אתה בטוח שברצונך למחוק את ההמלצה של "${deleteTarget.name}"?`
            : ''
        }
        confirmLabel="מחק"
        isLoading={isDeleting}
      />
    </div>
  );
}
