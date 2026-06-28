import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Bell, Shield, Eye, EyeOff, Moon, Sun, Info } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { toggleTheme } from '@/store/slices/uiSlice';
import type { RootState, AppDispatch } from '@/store';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import clsx from 'clsx';

const SettingsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { theme } = useSelector((state: RootState) => state.ui);

  const [notifs, setNotifs] = useState({
    teamAnnouncements: true,
    attendanceAlerts:  true,
    matchReminders:    true,
    reportDue:         true,
    injuryUpdates:     true,
    performanceAlerts: false,
  });

  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState(user?.email ?? '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async () => {
    await new Promise(r => setTimeout(r, 600));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const toggle = (key: keyof typeof notifs) => setNotifs(prev => ({ ...prev, [key]: !prev[key] }));

  const permissions = [
    { label: 'View Team Players',       granted: true },
    { label: 'View Team Analytics',     granted: true },
    { label: 'Monitor Attendance',      granted: true },
    { label: 'Create Announcements',    granted: true },
    { label: 'Monitor Performance',     granted: true },
    { label: 'Generate Team Reports',   granted: true },
    { label: 'View Match Information',  granted: true },
    { label: 'View Injury Records',     granted: true },
    { label: 'Mark Attendance (conditional)', granted: false, conditional: true },
    { label: 'Access Admin Dashboard',  granted: false },
    { label: 'Manage System Settings',  granted: false },
    { label: 'Create/Delete Players',   granted: false },
    { label: 'Assign Roles',            granted: false },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-gray-400 mt-1">Manage your account preferences and notification settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account Settings */}
        <div className="space-y-5">
          <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-white mb-5">Account Settings</h3>
            {saveSuccess && (
              <div className="mb-4 px-4 py-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400">
                ✓ Settings saved successfully!
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Email Address</label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full bg-dark-900 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white
                             focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">New Password</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'} placeholder="Leave blank to keep current"
                    className="w-full bg-dark-900 border border-dark-700 rounded-xl px-3 py-2.5 pr-10 text-sm text-white placeholder-gray-600
                               focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                  />
                  <button type="button" onClick={() => setShowPw(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                    {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <Button onClick={handleSave} size="sm">Save Changes</Button>
            </div>
          </div>

          {/* Appearance */}
          <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-white mb-4">Appearance</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {theme === 'dark' ? <Moon size={16} className="text-violet-400" /> : <Sun size={16} className="text-amber-400" />}
                <div>
                  <p className="text-sm text-white">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</p>
                  <p className="text-[11px] text-gray-500">Current appearance</p>
                </div>
              </div>
              <button
                onClick={() => dispatch(toggleTheme())}
                className={clsx(
                  'relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none',
                  theme === 'dark' ? 'bg-violet-600' : 'bg-gray-600',
                )}
                id="vc-settings-theme-toggle"
              >
                <span className={clsx(
                  'absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200',
                  theme === 'dark' ? 'translate-x-7' : 'translate-x-1',
                )} />
              </button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="space-y-5">
          <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
              <Bell size={14} className="text-violet-400" /> Notifications
            </h3>
            <p className="text-xs text-gray-500 mb-5">Choose which alerts you want to receive</p>
            <div className="space-y-3">
              {(Object.entries(notifs) as [keyof typeof notifs, boolean][]).map(([key, val]) => {
                const labels: Record<string, string> = {
                  teamAnnouncements: 'Team Announcements',
                  attendanceAlerts:  'Attendance Alerts',
                  matchReminders:    'Match Reminders',
                  reportDue:         'Report Due Reminders',
                  injuryUpdates:     'Injury Status Updates',
                  performanceAlerts: 'Performance Drop Alerts',
                };
                return (
                  <div key={key} className="flex items-center justify-between py-2">
                    <p className="text-sm text-gray-300">{labels[key]}</p>
                    <button
                      onClick={() => toggle(key)}
                      className={clsx(
                        'relative w-10 h-5 rounded-full transition-colors duration-200',
                        val ? 'bg-violet-600' : 'bg-dark-700 border border-dark-600',
                      )}
                    >
                      <span className={clsx(
                        'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200',
                        val ? 'translate-x-5' : 'translate-x-0.5',
                      )} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Permissions Info */}
          <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
              <Shield size={14} className="text-violet-400" /> Role Permissions
            </h3>
            <p className="text-xs text-gray-500 mb-4">Your Vice Captain access level</p>
            <div className="space-y-1.5">
              {permissions.map(p => (
                <div key={p.label} className="flex items-center gap-2 text-xs">
                  <span className={clsx(
                    'w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0',
                    p.granted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/10 text-red-400',
                  )}>
                    {p.granted ? '✓' : '✕'}
                  </span>
                  <span className={p.granted ? 'text-gray-300' : 'text-gray-600'}>{p.label}</span>
                  {p.conditional && (
                    <span className="flex items-center gap-0.5 text-[9px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-full">
                      <Info size={8} /> when Captain absent
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 px-3 py-2.5 bg-violet-500/10 border border-violet-500/20 rounded-xl">
              <p className="text-[11px] text-violet-300">
                To request additional permissions, contact your Coach or Captain.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
