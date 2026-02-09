export const BACKEND_URL = import.meta.env.VITE_API_URL;
// http://localhost:3000

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
  },

  // Health endpoint
  health: `${BACKEND_URL}/api/health`,

  // Note: Categories and assets are not API endpoints
  // Categories are embedded in project data, not fetched separately
  // Assets are static files served from the frontend, not API endpoints
};
