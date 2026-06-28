import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, User, ClipboardList, Users, TrendingUp,
  BarChart3, Swords, Megaphone, FileText, Activity, Settings,
  ChevronLeft, ChevronRight, Shield, Star,
} from 'lucide-react';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebarCollapse } from '@/store/slices/uiSlice';
import type { RootState } from '@/store';
import { ROUTES } from '@/utils/constants';

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
  color: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard',     icon: LayoutDashboard, path: ROUTES.VICE_CAPTAIN.DASHBOARD,     color: 'text-violet-400' },
  { label: 'Profile',       icon: User,            path: ROUTES.VICE_CAPTAIN.PROFILE,       color: 'text-blue-400' },
  { label: 'Attendance',    icon: ClipboardList,   path: ROUTES.VICE_CAPTAIN.ATTENDANCE,    color: 'text-emerald-400' },
  { label: 'Players',       icon: Users,           path: ROUTES.VICE_CAPTAIN.PLAYERS,       color: 'text-cyan-400' },
  { label: 'Performance',   icon: TrendingUp,      path: ROUTES.VICE_CAPTAIN.PERFORMANCE,   color: 'text-amber-400' },
  { label: 'Analytics',     icon: BarChart3,       path: ROUTES.VICE_CAPTAIN.ANALYTICS,     color: 'text-pink-400' },
  { label: 'Matches',       icon: Swords,          path: ROUTES.VICE_CAPTAIN.MATCHES,       color: 'text-orange-400' },
  { label: 'Announcements', icon: Megaphone,       path: ROUTES.VICE_CAPTAIN.ANNOUNCEMENTS, color: 'text-yellow-400' },
  { label: 'Reports',       icon: FileText,        path: ROUTES.VICE_CAPTAIN.REPORTS,       color: 'text-indigo-400' },
  { label: 'Injuries',      icon: Activity,        path: ROUTES.VICE_CAPTAIN.INJURIES,      color: 'text-red-400' },
];

const bottomNavItems: NavItem[] = [
  { label: 'Settings', icon: Settings, path: ROUTES.VICE_CAPTAIN.SETTINGS, color: 'text-gray-400' },
];

export const ViceCaptainSidebar: React.FC = () => {
  const dispatch = useDispatch();
  const collapsed = useSelector((state: RootState) => state.ui.sidebarCollapsed);
  const { user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  return (
    <aside className={clsx(
      'flex flex-col h-full bg-dark-900 border-r border-dark-700',
      'transition-all duration-300 ease-in-out shrink-0',
      collapsed ? 'w-[72px]' : 'w-64',
    )}>
      {/* Logo / Branding */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-dark-700">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shrink-0 shadow-glow-primary">
          <Star size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-white leading-tight">Sports MS</p>
            <p className="text-[10px] text-violet-400 truncate">Vice Captain Portal</p>
          </div>
        )}
        <button
          onClick={() => dispatch(toggleSidebarCollapse())}
          className={clsx(
            'ml-auto p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors',
            collapsed && 'mx-auto',
          )}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Vice Captain badge */}
      {!collapsed && user && (
        <div className="mx-3 mt-3 px-3 py-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20">
          <div className="flex items-center gap-2">
            <Shield size={13} className="text-violet-400 shrink-0" />
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-violet-300 truncate">{user.name}</p>
              <p className="text-[10px] text-gray-500">Vice Captain</p>
            </div>
          </div>
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 px-2 py-3 overflow-y-auto scrollbar-none space-y-0.5">
        {navItems.map(item => (
          <SidebarItem
            key={item.path}
            item={item}
            collapsed={collapsed}
            isActive={location.pathname === item.path}
          />
        ))}
      </nav>

      {/* Divider */}
      <div className="mx-3 border-t border-dark-700" />

      {/* Bottom nav */}
      <nav className="px-2 py-3 space-y-0.5">
        {bottomNavItems.map(item => (
          <SidebarItem
            key={item.path}
            item={item}
            collapsed={collapsed}
            isActive={location.pathname === item.path}
          />
        ))}
      </nav>
    </aside>
  );
};

const SidebarItem: React.FC<{
  item: NavItem;
  collapsed: boolean;
  isActive: boolean;
}> = ({ item, collapsed, isActive }) => {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      title={collapsed ? item.label : undefined}
      className={clsx(
        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium',
        'transition-all duration-200 group relative',
        isActive
          ? 'bg-violet-600/20 text-white border border-violet-500/30'
          : 'text-gray-400 hover:bg-white/5 hover:text-white',
        collapsed && 'justify-center',
      )}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-violet-500 rounded-r-full" />
      )}
      <Icon
        size={18}
        className={clsx(
          'shrink-0 transition-transform duration-200 group-hover:scale-110',
          isActive ? 'text-violet-400' : item.color,
        )}
      />
      {!collapsed && (
        <span className="truncate">{item.label}</span>
      )}
    </NavLink>
  );
};
