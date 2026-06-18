import React, { Suspense, lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { ROUTES } from '@/utils/constants';
import { ProtectedRoute, PublicRoute } from '@/routes/ProtectedRoute';
import { AdminLayout } from '@/layouts/AdminLayout';
import { AuthLayout }  from '@/layouts/AuthLayout';
import { PageLoader }  from '@/components/common/Spinner';

// Lazy loaded pages
const LoginPage         = lazy(() => import('@/pages/auth/LoginPage'));
const DashboardPage     = lazy(() => import('@/pages/admin/DashboardPage'));
const ProfilePage       = lazy(() => import('@/pages/admin/ProfilePage'));
const SettingsPage      = lazy(() => import('@/pages/admin/SettingsPage'));
const PlayerListPage    = lazy(() => import('@/pages/admin/players/PlayerListPage'));
const AttendancePage    = lazy(() => import('@/pages/admin/attendance/AttendancePage'));
const PerformancePage   = lazy(() => import('@/pages/admin/performance/PerformancePage'));
const AnalyticsPage     = lazy(() => import('@/pages/admin/analytics/AnalyticsPage'));
const MatchPage         = lazy(() => import('@/pages/admin/matches/MatchPage'));
const AchievementsPage  = lazy(() => import('@/pages/admin/achievements/AchievementsPage'));
const InjuriesPage      = lazy(() => import('@/pages/admin/injuries/InjuriesPage'));
const NotificationsPage = lazy(() => import('@/pages/admin/notifications/NotificationsPage'));

const withSuspense = (Component: React.LazyExoticComponent<React.FC>) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  // Public routes (auth)
  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: ROUTES.LOGIN, element: withSuspense(LoginPage) },
        ],
      },
    ],
  },
  // Protected admin routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: ROUTES.ADMIN.DASHBOARD,     element: withSuspense(DashboardPage) },
          { path: ROUTES.ADMIN.PROFILE,       element: withSuspense(ProfilePage) },
          { path: ROUTES.ADMIN.SETTINGS,      element: withSuspense(SettingsPage) },
          { path: ROUTES.ADMIN.PLAYERS,       element: withSuspense(PlayerListPage) },
          { path: ROUTES.ADMIN.ATTENDANCE,    element: withSuspense(AttendancePage) },
          { path: ROUTES.ADMIN.PERFORMANCE,   element: withSuspense(PerformancePage) },
          { path: ROUTES.ADMIN.ANALYTICS,     element: withSuspense(AnalyticsPage) },
          { path: ROUTES.ADMIN.MATCHES,       element: withSuspense(MatchPage) },
          { path: ROUTES.ADMIN.ACHIEVEMENTS,  element: withSuspense(AchievementsPage) },
          { path: ROUTES.ADMIN.INJURIES,      element: withSuspense(InjuriesPage) },
          { path: ROUTES.ADMIN.NOTIFICATIONS, element: withSuspense(NotificationsPage) },
        ],
      },
    ],
  },
  // Default redirect
  { path: '/', element: <React.Fragment />, loader: () => { window.location.href = ROUTES.ADMIN.DASHBOARD; return null; } },
  { path: '*', element: <div className="min-h-screen bg-dark-950 flex items-center justify-center"><div className="text-center"><h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1><p className="text-gray-500 mb-4">Page not found</p><a href={ROUTES.ADMIN.DASHBOARD} className="text-primary-400 hover:underline">Go to Dashboard →</a></div></div> },
]);
