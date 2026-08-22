import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/constants';

export default function AdminRoute() {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Admin and HR roles can access admin routes
  if (role !== ROLES.ADMIN && role !== ROLES.HR) {
    return <Navigate to="/employee/dashboard" replace />;
  }

  return <Outlet />;
}
