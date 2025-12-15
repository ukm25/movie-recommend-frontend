import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ROUTES, ROLES } from '../constants';

export const PrivateRoute = ({ children, allowedRoles }) => {
  const { currentUser, loading } = useAuth();

  // Chờ load session từ localStorage xong rồi mới quyết định redirect
  if (loading) {
    return null; // Có thể thay bằng spinner/loading UI nếu muốn
  }

  if (!currentUser) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    const defaultRoute = currentUser.role === ROLES.ADMIN 
      ? ROUTES.ADMIN_HISTORY 
      : ROUTES.VIEWER_RECOMMENDATIONS;
    return <Navigate to={defaultRoute} replace />;
  }

  return children;
};

