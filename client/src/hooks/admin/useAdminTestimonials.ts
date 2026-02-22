import { useState, useEffect, useCallback } from 'react';
import * as adminTestimonialsService from '../../services/admin/testimonials.service';
import type {
  TestimonialResponse,
  CreateTestimonialInput,
} from '@shirans/shared';

export function useAdminTestimonials() {
  const [testimonials, setTestimonials] = useState<TestimonialResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setError(null);
    setIsLoading(true);
    adminTestimonialsService
      .fetchAllTestimonials()
      .then(setTestimonials)
      .catch((err) => setError(err?.message ?? 'שגיאה בטעינת ההמלצות'))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    setIsLoading(true);
    adminTestimonialsService
      .fetchAllTestimonials()
      .then((data) => {
        if (!cancelled) setTestimonials(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message ?? 'שגיאה בטעינת ההמלצות');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const create = useCallback(
    async (input: CreateTestimonialInput) => {
      const created = await adminTestimonialsService.createTestimonial(input);
      setTestimonials((prev) => [created, ...prev]);
      return created;
    },
    []
  );

  const update = useCallback(
    async (id: string, input: Partial<CreateTestimonialInput>) => {
      const updated = await adminTestimonialsService.updateTestimonial(
        id,
        input
      );
      setTestimonials((prev) =>
        prev.map((t) => (t.id === updated.id ? updated : t))
      );
      return updated;
    },
    []
  );

  const remove = useCallback(async (id: string) => {
    await adminTestimonialsService.deleteTestimonial(id);
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const updateOrder = useCallback(
    async (id: string, order: number) => {
      const updated = await adminTestimonialsService.updateTestimonialOrder(
        id,
        order
      );
      setTestimonials((prev) =>
        prev.map((t) => (t.id === updated.id ? updated : t))
      );
      return updated;
    },
    []
  );

  return {
    testimonials,
    isLoading,
    error,
    refresh,
    create,
    update,
    delete: remove,
    updateOrder,
  };
}
