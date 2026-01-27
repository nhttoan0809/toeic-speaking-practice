import { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const AdminProtectedRoute = () => {
  const [isAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('admin_auth');
  });

  if (!isAuthenticated) {
    return <Navigate to="/toeic-speaking-practice/admin/login" replace />;
  }

  return <Outlet />;
};
