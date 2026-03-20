import type { QueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';

/** Admin project mutations affect public project list and detail caches. */
export function invalidateAfterAdminProjectsChange(
  queryClient: QueryClient
): void {
  void queryClient.invalidateQueries({ queryKey: queryKeys.admin.projects });
  void queryClient.invalidateQueries({ queryKey: queryKeys.projects });
}

/** Admin category mutations affect public category labels (e.g. project tags). */
export function invalidateAfterAdminCategoriesChange(
  queryClient: QueryClient
): void {
  void queryClient.invalidateQueries({ queryKey: queryKeys.admin.categories });
  void queryClient.invalidateQueries({ queryKey: queryKeys.categories });
}

/** Admin testimonial mutations affect the published testimonials strip on Home. */
export function invalidateAfterAdminTestimonialsChange(
  queryClient: QueryClient
): void {
  void queryClient.invalidateQueries({ queryKey: queryKeys.admin.testimonials });
  void queryClient.invalidateQueries({ queryKey: queryKeys.testimonials });
}
