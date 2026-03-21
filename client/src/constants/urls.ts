import { envConfig } from '@/config/env';

export const BACKEND_URL = envConfig.apiUrl;

export const BASE_URL = 'https://shiran-gilad.com';

/**
 * API Endpoints (SSOT - Single Source of Truth)
 * All endpoints follow the pattern: BACKEND_URL + /api/{resource}/{action}
 *
 * Server routes are mounted at:
 * - /api/auth -> auth routes
 * - /api/projects -> project routes
 * - /api -> health routes
 */
export const urls = {
  // Project endpoints (all require /api prefix)
  projects: `${BACKEND_URL}/api/projects`,
  favProjects: `${BACKEND_URL}/api/projects/favourites`,
  singleProject: `${BACKEND_URL}/api/projects/single`,
  updateProject: `${BACKEND_URL}/api/projects`,
  uploadImgs: `${BACKEND_URL}/api/projects/uploadImgs`,
  deleteMainImage: `${BACKEND_URL}/api/projects/deleteMainImage`,
  deleteProjectImages: `${BACKEND_URL}/api/projects/deleteImages`,
  reorderImages: `${BACKEND_URL}/api/projects/reorderImages`,

  // Auth endpoints (SSOT - Single Source of Truth)
  auth: {
    register: `${BACKEND_URL}/api/auth/register`,
    login: `${BACKEND_URL}/api/auth/login`,
    refresh: `${BACKEND_URL}/api/auth/refresh`,
    me: `${BACKEND_URL}/api/auth/me`,
    logout: `${BACKEND_URL}/api/auth/logout`,
  },

  // Contact endpoints
  contact: {
    submit: `${BACKEND_URL}/api/contact`,
  },

  // Categories endpoints
  categories: {
    getAll: `${BACKEND_URL}/api/categories`,
    create: `${BACKEND_URL}/api/categories`,
    update: (id: string) => `${BACKEND_URL}/api/categories/${id}`,
    delete: (id: string) => `${BACKEND_URL}/api/categories/${id}`,
  },

  // Testimonials endpoints
  testimonials: {
    published: `${BACKEND_URL}/api/testimonials/published`,
    getAll: `${BACKEND_URL}/api/testimonials`,
    create: `${BACKEND_URL}/api/testimonials`,
    getById: (id: string) => `${BACKEND_URL}/api/testimonials/${id}`,
    update: (id: string) => `${BACKEND_URL}/api/testimonials/${id}`,
    delete: (id: string) => `${BACKEND_URL}/api/testimonials/${id}`,
    updateOrder: (id: string) => `${BACKEND_URL}/api/testimonials/${id}/order`,
    bulkUpdate: `${BACKEND_URL}/api/testimonials/bulk`,
    bulkDelete: `${BACKEND_URL}/api/testimonials/bulk`,
  },

  // Admin user endpoints
  adminUsers: {
    getAll: `${BACKEND_URL}/api/users`,
  },

  // Admin contact endpoints
  adminContacts: {
    getAll: `${BACKEND_URL}/api/contact`,
    getById: (id: string) => `${BACKEND_URL}/api/contact/${id}`,
    updateRead: (id: string) => `${BACKEND_URL}/api/contact/${id}/read`,
    delete: (id: string) => `${BACKEND_URL}/api/contact/${id}`,
    bulkRead: `${BACKEND_URL}/api/contact/bulk/read`,
    bulkDelete: `${BACKEND_URL}/api/contact/bulk`,
  },

  // Calculator endpoints (admin only)
  calculator: {
    leads: `${BACKEND_URL}/api/calculator/leads`,
    leadById: (id: string) => `${BACKEND_URL}/api/calculator/leads/${id}`,
    leadRead: (id: string) => `${BACKEND_URL}/api/calculator/leads/${id}/read`,
    leadsBulkRead: `${BACKEND_URL}/api/calculator/leads/bulk/read`,
    leadsBulkDelete: `${BACKEND_URL}/api/calculator/leads/bulk`,
    config: `${BACKEND_URL}/api/calculator/config`,
  },

  // Health endpoint
  health: `${BACKEND_URL}/api/health`,

  // Note: Categories and assets are not API endpoints
  // Categories are embedded in project data, not fetched separately
  // Assets are static files served from the frontend, not API endpoints
};
