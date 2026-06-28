import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, Sun, Moon, ChevronDown, LogOut, User, Settings, Menu } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import clsx from 'clsx';
import type { RootState, AppDispatch } from '@/store';
import { toggleTheme, toggleSidebar } from '@/store/slices/uiSlice';
import { logout } from '@/store/slices/authSlice';
import { ROUTES } from '@/utils/constants';
import { Avatar } from '@/components/common/Avatar';

export const ViceCaptainTopbar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { theme } = useSelector((state: RootState) => state.ui);
  const unreadCount = useSelector((state: RootState) => state.notifications.unreadCount);

  const [search, setSearch] = useState('');
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate(ROUTES.LOGIN);
  };

  const notifications = [
    { emoji: '📋', title: '2 players below attendance threshold', sub: 'Kiran Rao & Suresh Babu need attention' },
    { emoji: '🏆', title: 'Match vs BMS College in 7 days',     sub: 'Jul 2, 2026 — Confirm lineup by Jun 30' },
    { emoji: '⚡', title: 'Weekly report due today',             sub: 'Submit report for Week 26 to Coach' },
  ];

  return (
    <header className="h-16 bg-dark-900 border-b border-dark-700 flex items-center px-4 gap-4 shrink-0">
      {/* Mobile menu */}
      <button
        onClick={() => dispatch(toggleSidebar())}
        className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors lg:hidden"
        aria-label="Toggle menu"
      >
        <Menu size={20} />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search players, matches, announcements..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            id="vc-topbar-search"
            className="w-full bg-dark-800 border border-dark-700 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500
                       focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-1.5 ml-auto">
        {/* Theme toggle */}
        <button
          onClick={() => dispatch(toggleTheme())}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Toggle theme"
          id="vc-theme-toggle"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen(v => !v)}
            className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Notifications"
            id="vc-notifications-bell"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-violet-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center animate-pulse-slow">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-dark-800 border border-dark-700 rounded-2xl shadow-2xl z-50 animate-slide-up">
              <div className="flex items-center justify-between px-4 py-3 border-b border-dark-700">
                <p className="text-sm font-semibold text-white">Notifications</p>
                <span className="text-xs text-violet-400">{notifications.length} alerts</span>
              </div>
              <div className="py-3 px-3 space-y-2">
                {notifications.map((n, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-violet-500/5 border border-violet-500/15">
                    <span className="text-lg mt-0.5">{n.emoji}</span>
                    <div>
                      <p className="text-xs font-medium text-white">{n.title}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">{n.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-dark-700 px-4 py-3">
                <p className="text-xs text-gray-600 text-center">Vice Captain team alerts</p>
              </div>
            </div>
          )}
        </div>

        {/* Profile menu */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setProfileMenuOpen(v => !v)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-white/10 transition-colors"
            id="vc-profile-menu-btn"
          >
            <Avatar name={user?.name ?? 'VC'} src={(user as { photoUrl?: string })?.photoUrl} size="sm" />
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-white leading-tight">{user?.name ?? 'Vice Captain'}</p>
              <p className="text-[10px] text-violet-400">Vice Captain</p>
            </div>
            <ChevronDown size={14} className={clsx('text-gray-400 transition-transform', profileMenuOpen && 'rotate-180')} />
          </button>
          {profileMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-dark-800 border border-dark-700 rounded-2xl shadow-2xl z-50 animate-slide-up overflow-hidden">
              <div className="px-4 py-3 border-b border-dark-700">
                <p className="text-sm font-semibold text-white">{user?.name ?? 'Vice Captain'}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  Vice Captain
                </span>
              </div>
              <div className="py-1">
                <MenuDropItem icon={User} label="My Profile" onClick={() => { navigate(ROUTES.VICE_CAPTAIN.PROFILE); setProfileMenuOpen(false); }} />
                <MenuDropItem icon={Settings} label="Settings"   onClick={() => { navigate(ROUTES.VICE_CAPTAIN.SETTINGS); setProfileMenuOpen(false); }} />
                <div className="border-t border-dark-700 mt-1 pt-1">
                  <MenuDropItem icon={LogOut} label="Sign Out" onClick={handleLogout} danger />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const MenuDropItem: React.FC<{
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  danger?: boolean;
}> = ({ icon: Icon, label, onClick, danger }) => (
  <button
    onClick={onClick}
    className={clsx(
      'w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors',
      danger ? 'text-red-400 hover:bg-red-500/10' : 'text-gray-300 hover:bg-white/5 hover:text-white',
    )}
  >
    <Icon size={15} className="shrink-0" />
    {label}
  </button>
);
