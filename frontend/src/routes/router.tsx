import React, { Suspense, lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { ROUTES } from '@/utils/constants';
import { ProtectedRoute, PublicRoute } from '@/routes/ProtectedRoute';
import { AdminLayout } from '@/layouts/AdminLayout';
import { PlayerLayout } from '@/layouts/PlayerLayout';
import { AuthLayout }  from '@/layouts/AuthLayout';
import { PageLoader }  from '@/components/common/Spinner';

// ─── Admin (Coach) pages ───────────────────────────────────────────────────
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

// ─── Player pages ──────────────────────────────────────────────────────────
const PlayerDashboardPage  = lazy(() => import('@/pages/player/DashboardPage'));
const PlayerProfilePage    = lazy(() => import('@/pages/player/ProfilePage'));
const PlayerAttendancePage = lazy(() => import('@/pages/player/AttendancePage'));
const PlayerPerformancePage= lazy(() => import('@/pages/player/PerformancePage'));
const PlayerAnalyticsPage  = lazy(() => import('@/pages/player/AnalyticsPage'));
const PlayerMatchesPage    = lazy(() => import('@/pages/player/MatchesPage'));
const PlayerAchievementsPage=lazy(() => import('@/pages/player/AchievementsPage'));
const PlayerFeedbackPage   = lazy(() => import('@/pages/player/FeedbackPage'));
const PlayerInjuriesPage   = lazy(() => import('@/pages/player/InjuriesPage'));
const PlayerSettingsPage   = lazy(() => import('@/pages/player/SettingsPage'));

const withSuspense = (Component: React.LazyExoticComponent<React.FC>) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  // ── Public routes (auth) ────────────────────────────────────────────────
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

  // ── Protected Coach / Captain routes ────────────────────────────────────
  {
    element: <ProtectedRoute allowedRoles={['COACH', 'CAPTAIN']} />,
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

  // ── Protected Player routes ─────────────────────────────────────────────
  {
    element: <ProtectedRoute allowedRoles={['PLAYER']} />,
    children: [
      {
        element: <PlayerLayout />,
        children: [
          { path: ROUTES.PLAYER.DASHBOARD,    element: withSuspense(PlayerDashboardPage) },
          { path: ROUTES.PLAYER.PROFILE,      element: withSuspense(PlayerProfilePage) },
          { path: ROUTES.PLAYER.ATTENDANCE,   element: withSuspense(PlayerAttendancePage) },
          { path: ROUTES.PLAYER.PERFORMANCE,  element: withSuspense(PlayerPerformancePage) },
          { path: ROUTES.PLAYER.ANALYTICS,    element: withSuspense(PlayerAnalyticsPage) },
          { path: ROUTES.PLAYER.MATCHES,      element: withSuspense(PlayerMatchesPage) },
          { path: ROUTES.PLAYER.ACHIEVEMENTS, element: withSuspense(PlayerAchievementsPage) },
          { path: ROUTES.PLAYER.FEEDBACK,     element: withSuspense(PlayerFeedbackPage) },
          { path: ROUTES.PLAYER.INJURIES,     element: withSuspense(PlayerInjuriesPage) },
          { path: ROUTES.PLAYER.SETTINGS,     element: withSuspense(PlayerSettingsPage) },
        ],
      },
    ],
  },

  // ── Default redirect ────────────────────────────────────────────────────
  {
    path: '/',
    element: <React.Fragment />,
    loader: () => { window.location.href = ROUTES.LOGIN; return null; },
  },
  {
    path: '*',
    element: (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
          <p className="text-gray-500 mb-4">Page not found</p>
          <a href={ROUTES.LOGIN} className="text-primary-400 hover:underline">Go to Login →</a>
        </div>
      </div>
    ),
  },
]);
