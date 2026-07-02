import React, { Suspense, lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { ROUTES } from '@/utils/constants';
import { ProtectedRoute, PublicRoute } from '@/routes/ProtectedRoute';
import { AdminLayout } from '@/layouts/AdminLayout';
import { PlayerLayout } from '@/layouts/PlayerLayout';
import { ViceCaptainLayout } from '@/layouts/ViceCaptainLayout';
import { CaptainLayout } from '@/layouts/CaptainLayout';
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

// ─── Vice Captain pages ────────────────────────────────────────────────────
const VCDashboardPage     = lazy(() => import('@/pages/vice-captain/DashboardPage'));
const VCProfilePage       = lazy(() => import('@/pages/vice-captain/ProfilePage'));
const VCAttendancePage    = lazy(() => import('@/pages/vice-captain/AttendancePage'));
const VCPlayersPage       = lazy(() => import('@/pages/vice-captain/PlayersPage'));
const VCPerformancePage   = lazy(() => import('@/pages/vice-captain/PerformancePage'));
const VCAnalyticsPage     = lazy(() => import('@/pages/vice-captain/AnalyticsPage'));
const VCMatchesPage       = lazy(() => import('@/pages/vice-captain/MatchesPage'));
const VCAnnouncementsPage = lazy(() => import('@/pages/vice-captain/AnnouncementsPage'));
const VCReportsPage       = lazy(() => import('@/pages/vice-captain/ReportsPage'));
const VCInjuriesPage      = lazy(() => import('@/pages/vice-captain/InjuriesPage'));
const VCSettingsPage      = lazy(() => import('@/pages/vice-captain/SettingsPage'));

// ─── Captain pages ──────────────────────────────────────────────────────────
const CapDashboardPage     = lazy(() => import('@/pages/captain/DashboardPage'));
const CapProfilePage       = lazy(() => import('@/pages/captain/ProfilePage'));
const CapAttendancePage    = lazy(() => import('@/pages/captain/AttendancePage'));
const CapPerformancePage   = lazy(() => import('@/pages/captain/PerformancePage'));
const CapAnalyticsPage     = lazy(() => import('@/pages/captain/AnalyticsPage'));
const CapPlayersPage       = lazy(() => import('@/pages/captain/PlayersPage'));
const CapMatchesPage       = lazy(() => import('@/pages/captain/MatchesPage'));
const CapAnnouncementsPage = lazy(() => import('@/pages/captain/AnnouncementsPage'));
const CapFeedbackPage      = lazy(() => import('@/pages/captain/FeedbackPage'));
const CapSettingsPage      = lazy(() => import('@/pages/captain/SettingsPage'));

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

  // ── Protected Vice Captain routes ────────────────────────────────────────
  {
    element: <ProtectedRoute allowedRoles={['VICE_CAPTAIN']} />,
    children: [
      {
        element: <ViceCaptainLayout />,
        children: [
          { path: ROUTES.VICE_CAPTAIN.DASHBOARD,     element: withSuspense(VCDashboardPage) },
          { path: ROUTES.VICE_CAPTAIN.PROFILE,       element: withSuspense(VCProfilePage) },
          { path: ROUTES.VICE_CAPTAIN.ATTENDANCE,    element: withSuspense(VCAttendancePage) },
          { path: ROUTES.VICE_CAPTAIN.PLAYERS,       element: withSuspense(VCPlayersPage) },
          { path: ROUTES.VICE_CAPTAIN.PERFORMANCE,   element: withSuspense(VCPerformancePage) },
          { path: ROUTES.VICE_CAPTAIN.ANALYTICS,     element: withSuspense(VCAnalyticsPage) },
          { path: ROUTES.VICE_CAPTAIN.MATCHES,       element: withSuspense(VCMatchesPage) },
          { path: ROUTES.VICE_CAPTAIN.ANNOUNCEMENTS, element: withSuspense(VCAnnouncementsPage) },
          { path: ROUTES.VICE_CAPTAIN.REPORTS,       element: withSuspense(VCReportsPage) },
          { path: ROUTES.VICE_CAPTAIN.INJURIES,      element: withSuspense(VCInjuriesPage) },
          { path: ROUTES.VICE_CAPTAIN.SETTINGS,      element: withSuspense(VCSettingsPage) },
        ],
      },
    ],
  },

  // ── Protected Captain routes ──────────────────────────────────────────────
  {
    element: <ProtectedRoute allowedRoles={['CAPTAIN']} />,
    children: [
      {
        element: <CaptainLayout />,
        children: [
          { path: ROUTES.CAPTAIN.DASHBOARD,     element: withSuspense(CapDashboardPage) },
          { path: ROUTES.CAPTAIN.PROFILE,       element: withSuspense(CapProfilePage) },
          { path: ROUTES.CAPTAIN.ATTENDANCE,    element: withSuspense(CapAttendancePage) },
          { path: ROUTES.CAPTAIN.PERFORMANCE,   element: withSuspense(CapPerformancePage) },
          { path: ROUTES.CAPTAIN.ANALYTICS,     element: withSuspense(CapAnalyticsPage) },
          { path: ROUTES.CAPTAIN.PLAYERS,       element: withSuspense(CapPlayersPage) },
          { path: ROUTES.CAPTAIN.MATCHES,       element: withSuspense(CapMatchesPage) },
          { path: ROUTES.CAPTAIN.ANNOUNCEMENTS, element: withSuspense(CapAnnouncementsPage) },
          { path: ROUTES.CAPTAIN.FEEDBACK,      element: withSuspense(CapFeedbackPage) },
          { path: ROUTES.CAPTAIN.SETTINGS,      element: withSuspense(CapSettingsPage) },
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
