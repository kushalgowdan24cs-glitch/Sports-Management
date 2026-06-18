import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { ROUTES } from '@/utils/constants';

export const ProtectedRoute: React.FC = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to={ROUTES.LOGIN} replace />;
};

export const PublicRoute: React.FC = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  return isAuthenticated ? <Navigate to={ROUTES.ADMIN.DASHBOARD} replace /> : <Outlet />;
};
