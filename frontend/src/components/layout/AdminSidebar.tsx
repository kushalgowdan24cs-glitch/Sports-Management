import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, ClipboardList, TrendingUp, BarChart3,
  Trophy, Swords, Bell, User, Settings, ChevronLeft, ChevronRight,
  Activity, Shield, Medal,
} from 'lucide-react';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebarCollapse } from '@/store/slices/uiSlice';
import type { RootState } from '@/store';
import { ROUTES } from '@/utils/constants';

interface NavItem {
  label: string;
  icon: React.ComponentType<any>;
  path: string;
  color: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard',     icon: LayoutDashboard, path: ROUTES.ADMIN.DASHBOARD,     color: 'text-primary-400' },
  { label: 'Players',       icon: Users,            path: ROUTES.ADMIN.PLAYERS,       color: 'text-blue-400' },
  { label: 'Attendance',    icon: ClipboardList,    path: ROUTES.ADMIN.ATTENDANCE,    color: 'text-emerald-400' },
  { label: 'Performance',   icon: TrendingUp,       path: ROUTES.ADMIN.PERFORMANCE,   color: 'text-violet-400' },
  { label: 'Analytics',     icon: BarChart3,        path: ROUTES.ADMIN.ANALYTICS,     color: 'text-cyan-400' },
  { label: 'Matches',       icon: Swords,           path: ROUTES.ADMIN.MATCHES,       color: 'text-amber-400' },
  { label: 'Achievements',  icon: Trophy,           path: ROUTES.ADMIN.ACHIEVEMENTS,  color: 'text-yellow-400' },
  { label: 'Injuries',      icon: Activity,         path: ROUTES.ADMIN.INJURIES,      color: 'text-red-400' },
  { label: 'Notifications', icon: Bell,             path: ROUTES.ADMIN.NOTIFICATIONS, color: 'text-pink-400' },
];

const bottomNavItems: NavItem[] = [
  { label: 'Profile',  icon: User,     path: ROUTES.ADMIN.PROFILE,  color: 'text-gray-400' },
  { label: 'Settings', icon: Settings, path: ROUTES.ADMIN.SETTINGS, color: 'text-gray-400' },
];

export const AdminSidebar: React.FC = () => {
  const dispatch = useDispatch();
  const collapsed = useSelector((state: RootState) => state.ui.sidebarCollapsed);
  const location = useLocation();

  return (
    <aside className={clsx(
      'flex flex-col h-full bg-dark-900 border-r border-dark-700',
      'transition-all duration-300 ease-in-out shrink-0',
      collapsed ? 'w-[72px]' : 'w-64',
    )}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-dark-700">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-violet-600 shrink-0 shadow-glow-primary">
          <Shield size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-white leading-tight">Sports MS</p>
            <p className="text-[10px] text-gray-500 truncate">Coach Dashboard</p>
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

      {/* Coach badge */}
      {!collapsed && (
        <div className="mx-3 mt-3 px-3 py-2 rounded-xl bg-primary-500/10 border border-primary-500/20">
          <div className="flex items-center gap-2">
            <Medal size={14} className="text-primary-400 shrink-0" />
            <span className="text-xs text-primary-300 font-medium">Admin / Coach</span>
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
          ? 'bg-primary-600/20 text-white border border-primary-500/30'
          : 'text-gray-400 hover:bg-white/5 hover:text-white',
        collapsed && 'justify-center',
      )}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary-500 rounded-r-full" />
      )}
      <Icon
        size={18}
        className={clsx(
          'shrink-0 transition-transform duration-200 group-hover:scale-110',
          isActive ? 'text-primary-400' : item.color,
        )}
      />
      {!collapsed && (
        <span className="truncate">{item.label}</span>
      )}
    </NavLink>
  );
};
