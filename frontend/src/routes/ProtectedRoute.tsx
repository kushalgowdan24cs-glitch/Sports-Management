import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { ROUTES } from '@/utils/constants';

type Role = 'COACH' | 'CAPTAIN' | 'VICE_CAPTAIN' | 'PLAYER';

function getDefaultRoute(role: Role | undefined): string {
  if (role === 'PLAYER')        return ROUTES.PLAYER.DASHBOARD;
  if (role === 'VICE_CAPTAIN')  return ROUTES.VICE_CAPTAIN.DASHBOARD;
  if (role === 'CAPTAIN')       return ROUTES.CAPTAIN.DASHBOARD;
  return ROUTES.ADMIN.DASHBOARD;
}

/** Wraps unauthenticated-only pages (e.g. login). Redirects authenticated users to their dashboard. */
export const PublicRoute: React.FC = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  if (!isAuthenticated) return <Outlet />;
  return <Navigate to={getDefaultRoute(user?.role as Role | undefined)} replace />;
};

/** Requires authentication. Optionally restricts to specific roles. */
export const ProtectedRoute: React.FC<{ allowedRoles?: Role[] }> = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace />;

  if (allowedRoles && user?.role && !allowedRoles.includes(user.role as Role)) {
    // Redirect to the correct dashboard for their role
    return <Navigate to={getDefaultRoute(user.role as Role)} replace />;
  }

  return <Outlet />;
};
