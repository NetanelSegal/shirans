const MAIN_URL = "https://shiran-s-server.onrender.com"
// http://localhost:3000

export const BASE_URL = "https://shiran-gilad.com"

/**
 * API Endpoints (SSOT - Single Source of Truth)
 * All endpoints follow the pattern: MAIN_URL + /api/{resource}/{action}
 * 
 * Server routes are mounted at:
 * - /api/auth -> auth routes
 * - /api/projects -> project routes
 * - /api -> health routes
 */
export const urls = {
    // Project endpoints (all require /api prefix)
    projects: `${MAIN_URL}/api/projects`,
    favProjects: `${MAIN_URL}/api/projects/favourites`,
    singleProject: `${MAIN_URL}/api/projects/single`,
    updateProject: `${MAIN_URL}/api/projects`,
    uploadImgs: `${MAIN_URL}/api/projects/uploadImgs`,
    deleteMainImage: `${MAIN_URL}/api/projects/deleteMainImage`,
    deleteProjectImages: `${MAIN_URL}/api/projects/deleteImages`,
    
    // Auth endpoints (SSOT - Single Source of Truth)
    auth: {
        register: `${MAIN_URL}/api/auth/register`,
        login: `${MAIN_URL}/api/auth/login`,
        me: `${MAIN_URL}/api/auth/me`,
        logout: `${MAIN_URL}/api/auth/logout`,
    },
    
    // Health endpoint
    health: `${MAIN_URL}/api/health`,
    
    // Note: Categories and assets are not API endpoints
    // Categories are embedded in project data, not fetched separately
    // Assets are static files served from the frontend, not API endpoints
}
