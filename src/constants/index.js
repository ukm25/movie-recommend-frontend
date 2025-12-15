// User roles
export const ROLES = {
  ADMIN: 'admin',
  VIEWER: 'viewer'
};

// Routes
export const ROUTES = {
  LOGIN: '/login',
  ADMIN_HISTORY: '/admin/history',
  ADMIN_TRENDS: '/admin/trends',
  VIEWER_RECOMMENDATIONS: '/viewer/recommendations',
  VIEWER_MOVIES: '/viewer/movies'
};

// API Configuration
export const API_URL = process.env.REACT_APP_API_URL || 'https://movie-recommend-api-1.onrender.com/api';

