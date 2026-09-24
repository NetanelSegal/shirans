/**
 * Query keys SSOT for TanStack Query.
 * Use factory functions for parameterized keys to enable targeted invalidation.
 */
export const queryKeys = {
  projects: ['projects'] as const,
  project: (id: string) => ['projects', id] as const,
  /** Placeholder key when project id is missing; query stays disabled. */
  projectDetailDisabled: ['projects', 'detail', '__disabled__'] as const,
  categories: ['categories'] as const,
  testimonials: ['testimonials'] as const,
  articles: ['articles'] as const,
  article: (slug: string) => ['articles', slug] as const,
  calculatorConfig: ['calculator', 'config'] as const,
  admin: {
    projects: ['admin', 'projects'] as const,
    categories: ['admin', 'categories'] as const,
    testimonials: ['admin', 'testimonials'] as const,
    articles: ['admin', 'articles'] as const,
    article: (id: string) => ['admin', 'articles', id] as const,
    contacts: ['admin', 'contacts'] as const,
    users: ['admin', 'users'] as const,
    calculatorLeads: ['admin', 'calculatorLeads'] as const,
  },
};
