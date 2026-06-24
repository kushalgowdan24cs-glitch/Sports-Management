import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Sun, Moon, Bell, Shield, Globe, Palette } from 'lucide-react';
import clsx from 'clsx';
import type { RootState, AppDispatch } from '@/store';
import { toggleTheme } from '@/store/slices/uiSlice';

interface ToggleProps { enabled: boolean; onChange: (v: boolean) => void; id: string; }
const Toggle: React.FC<ToggleProps> = ({ enabled, onChange, id }) => (
  <button
    id={id}
    onClick={() => onChange(!enabled)}
    className={clsx(
      'relative inline-flex w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none shrink-0',
      enabled ? 'bg-emerald-500' : 'bg-dark-700',
    )}
    role="switch"
    aria-checked={enabled}
  >
    <span className={clsx(
      'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200',
      enabled ? 'translate-x-5' : 'translate-x-0',
    )} />
  </button>
);

interface SettingRowProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}
const SettingRow: React.FC<SettingRowProps> = ({ icon, title, description, children }) => (
  <div className="flex items-center justify-between p-4 rounded-xl hover:bg-white/3 transition-colors">
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-gray-400">{icon}</div>
      <div>
        <p className="text-sm font-medium text-white">{title}</p>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
    </div>
    <div className="ml-4 shrink-0">{children}</div>
  </div>
);

const SettingsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { theme } = useSelector((state: RootState) => state.ui);

  const [notifs, setNotifs] = useState({
    matchReminders: true,
    feedbackAlerts: true,
    achievementAlerts: true,
    injuryUpdates: false,
    weeklyReport: true,
  });
  const [privacy, setPrivacy] = useState({
    showProfile: true,
    showStats: false,
  });
  const [language, setLanguage] = useState('English');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-gray-400 mt-1">Manage your preferences and account settings</p>
      </div>

      {/* Appearance */}
      <div className="bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-dark-700">
          <Palette size={14} className="text-primary-400" />
          <h3 className="text-sm font-semibold text-white">Appearance</h3>
        </div>
        <div className="divide-y divide-dark-700/50">
          <SettingRow
            icon={theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
            title="Theme"
            description={`Currently using ${theme === 'dark' ? 'Dark' : 'Light'} mode`}
          >
            <div className="flex gap-2">
              {(['dark', 'light'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => { if (theme !== t) dispatch(toggleTheme()); }}
                  className={clsx(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                    theme === t
                      ? 'bg-primary-600 text-white border-primary-500'
                      : 'bg-dark-700 text-gray-400 border-dark-700 hover:text-white',
                  )}
                >
                  {t === 'dark' ? <Moon size={11} /> : <Sun size={11} />}
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </SettingRow>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-dark-700">
          <Bell size={14} className="text-emerald-400" />
          <h3 className="text-sm font-semibold text-white">Notifications</h3>
        </div>
        <div className="divide-y divide-dark-700/50">
          {[
            { key: 'matchReminders'    as const, title: 'Match Reminders',    desc: 'Get notified before upcoming matches' },
            { key: 'feedbackAlerts'    as const, title: 'Coach Feedback',     desc: 'Notify when coach posts new feedback' },
            { key: 'achievementAlerts' as const, title: 'Achievements',       desc: 'Celebrate when you earn a new badge or award' },
            { key: 'injuryUpdates'     as const, title: 'Injury Updates',     desc: 'Receive updates on injury status changes' },
            { key: 'weeklyReport'      as const, title: 'Weekly Summary',     desc: 'Get a weekly performance digest every Monday' },
          ].map(({ key, title, desc }) => (
            <SettingRow key={key} icon={<Bell size={15} />} title={title} description={desc}>
              <Toggle id={`notif-${key}`} enabled={notifs[key]} onChange={v => setNotifs(n => ({ ...n, [key]: v }))} />
            </SettingRow>
          ))}
        </div>
      </div>

      {/* Privacy */}
      <div className="bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-dark-700">
          <Shield size={14} className="text-amber-400" />
          <h3 className="text-sm font-semibold text-white">Privacy</h3>
        </div>
        <div className="divide-y divide-dark-700/50">
          <SettingRow icon={<Shield size={15} />} title="Show Profile to Teammates" description="Allow team members to view your basic profile">
            <Toggle id="privacy-profile" enabled={privacy.showProfile} onChange={v => setPrivacy(p => ({ ...p, showProfile: v }))} />
          </SettingRow>
          <SettingRow icon={<Shield size={15} />} title="Show Stats to Teammates" description="Allow team members to see your performance stats">
            <Toggle id="privacy-stats" enabled={privacy.showStats} onChange={v => setPrivacy(p => ({ ...p, showStats: v }))} />
          </SettingRow>
        </div>
      </div>

      {/* Language */}
      <div className="bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-dark-700">
          <Globe size={14} className="text-cyan-400" />
          <h3 className="text-sm font-semibold text-white">Language & Region</h3>
        </div>
        <div className="p-5">
          <label className="block text-xs font-medium text-gray-400 mb-2">Display Language</label>
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            id="language-select"
            className="bg-dark-900 border border-dark-700 rounded-xl px-3 py-2 text-sm text-white
                       focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 w-full max-w-xs"
          >
            {['English', 'Kannada', 'Hindi', 'Tamil', 'Telugu'].map(l => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Security Info */}
      <div className="p-4 rounded-2xl bg-dark-800 border border-dark-700 flex items-start gap-3">
        <Shield size={16} className="text-emerald-400 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-white mb-1">Security Notice</p>
          <p className="text-xs text-gray-400 leading-relaxed">
            Your account is protected with role-based access control. As a player, you can only view your own data.
            You do not have permission to modify attendance records, performance scores, or other players' information.
            To change your password, go to <span className="text-primary-400">My Profile → Change Password</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
