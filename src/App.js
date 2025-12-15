import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute } from './routes/PrivateRoute';
import { ROUTES, ROLES } from './constants';
import LoginPage from './pages/LoginPage';
import AdminHistoryPage from './pages/Admin/AdminHistoryPage';
import AdminTrendsPage from './pages/Admin/AdminTrendsPage';
import ViewerRecommendationsPage from './pages/Viewer/ViewerRecommendationsPage';
import ViewerMoviesPage from './pages/Viewer/ViewerMoviesPage';
import './styles/App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          
          <Route 
            path={ROUTES.ADMIN_HISTORY} 
            element={
              <PrivateRoute allowedRoles={[ROLES.ADMIN]}>
                <AdminHistoryPage />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path={ROUTES.ADMIN_TRENDS} 
            element={
              <PrivateRoute allowedRoles={[ROLES.ADMIN]}>
                <AdminTrendsPage />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path={ROUTES.VIEWER_RECOMMENDATIONS} 
            element={
              <PrivateRoute allowedRoles={[ROLES.VIEWER]}>
                <ViewerRecommendationsPage />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path={ROUTES.VIEWER_MOVIES} 
            element={
              <PrivateRoute allowedRoles={[ROLES.VIEWER]}>
                <ViewerMoviesPage />
              </PrivateRoute>
            } 
          />
          
          <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
          <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

