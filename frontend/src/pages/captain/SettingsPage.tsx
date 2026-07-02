import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Bell, Moon, Sun, Shield, Eye, Globe, Save, Check } from 'lucide-react';
import { toggleTheme } from '@/store/slices/uiSlice';
import type { RootState, AppDispatch } from '@/store';
import clsx from 'clsx';

const SettingsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { theme } = useSelector((state: RootState) => state.ui);
  const { user }  = useSelector((state: RootState) => state.auth);

  const [notifications, setNotifications] = useState({
    matchReminders:    true,
    attendanceAlerts:  true,
    performanceUpdates:false,
    teamAnnouncements: true,
    coachMessages:     true,
    emailDigest:       false,
  });

  const [privacy, setPrivacy] = useState({
    showProfile:        true,
    showStats:          true,
    showAttendance:     false,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    await new Promise(r => setTimeout(r, 500));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const ToggleSwitch: React.FC<{ checked: boolean; onChange: () => void; id: string }> = ({ checked, onChange, id }) => (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={clsx(
        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none',
        checked ? 'bg-emerald-500' : 'bg-dark-600',
      )}
    >
      <span className={clsx(
        'inline-block w-4 h-4 transform rounded-full bg-white shadow transition-transform duration-200',
        checked ? 'translate-x-6' : 'translate-x-1',
      )} />
    </button>
  );

  const SectionCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
        {icon} {title}
      </h3>
      {children}
    </div>
  );

  const SettingRow: React.FC<{ label: string; desc: string; id: string; checked: boolean; onChange: () => void }> = ({ label, desc, id, checked, onChange }) => (
    <div className="flex items-center justify-between py-3 border-b border-dark-700/50 last:border-0">
      <div className="flex-1 pr-4">
        <p className="text-sm text-white">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
      </div>
      <ToggleSwitch id={id} checked={checked} onChange={onChange} />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-sm text-gray-400 mt-1">Customize your Captain portal preferences</p>
        </div>
        <button onClick={handleSave}
          className={clsx(
            'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all',
            saved
              ? 'bg-emerald-600/20 border border-emerald-500/30 text-emerald-400'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white',
          )}>
          {saved ? <><Check size={16} /> Saved!</> : <><Save size={16} /> Save Changes</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Appearance */}
        <SectionCard title="Appearance" icon={<Sun size={14} className="text-amber-400" />}>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm text-white">Theme</p>
              <p className="text-xs text-gray-500 mt-0.5">Switch between dark and light mode</p>
            </div>
            <button
              onClick={() => dispatch(toggleTheme())}
              id="captain-settings-theme"
              className={clsx(
                'flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all',
                theme === 'dark'
                  ? 'bg-dark-700 border-dark-600 text-gray-300 hover:border-emerald-500/40'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-400',
              )}
            >
              {theme === 'dark' ? <><Moon size={14} /> Dark</> : <><Sun size={14} /> Light</>}
            </button>
          </div>

          <div className="py-3 border-t border-dark-700/50">
            <p className="text-sm text-white mb-2">Dashboard Accent Color</p>
            <div className="flex gap-2">
              {[
                { color: 'bg-emerald-500', ring: 'ring-emerald-500', name: 'Emerald' },
                { color: 'bg-teal-500',    ring: 'ring-teal-500',    name: 'Teal' },
                { color: 'bg-cyan-500',    ring: 'ring-cyan-500',    name: 'Cyan' },
                { color: 'bg-violet-500',  ring: 'ring-violet-500',  name: 'Violet' },
                { color: 'bg-amber-500',   ring: 'ring-amber-500',   name: 'Amber' },
              ].map((c, i) => (
                <button key={c.name}
                  className={clsx(
                    'w-8 h-8 rounded-full transition-all',
                    c.color,
                    i === 0 ? `ring-2 ${c.ring} ring-offset-2 ring-offset-dark-800 scale-110` : 'opacity-60 hover:opacity-100',
                  )}
                  title={c.name}
                />
              ))}
            </div>
          </div>
        </SectionCard>

        {/* Account Info */}
        <SectionCard title="Account" icon={<Shield size={14} className="text-emerald-400" />}>
          <div className="space-y-3">
            {[
              { label: 'Name',  value: user?.name ?? 'Captain' },
              { label: 'Email', value: user?.email ?? 'captain@college.edu' },
              { label: 'Role',  value: 'Team Captain' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-dark-700/50 last:border-0">
                <span className="text-xs text-gray-500 w-16">{item.label}</span>
                <span className="text-sm text-white font-medium">{item.value}</span>
              </div>
            ))}
            <div className="pt-2">
              <p className="text-[10px] text-gray-600">To change your email or name, contact the Coach/Admin.</p>
            </div>
          </div>
        </SectionCard>

        {/* Notifications */}
        <SectionCard title="Notifications" icon={<Bell size={14} className="text-yellow-400" />}>
          <SettingRow
            id="cap-notif-match"
            label="Match Reminders"
            desc="Get notified 24h before scheduled matches"
            checked={notifications.matchReminders}
            onChange={() => setNotifications(p => ({ ...p, matchReminders: !p.matchReminders }))}
          />
          <SettingRow
            id="cap-notif-att"
            label="Attendance Alerts"
            desc="Alerts when players drop below 75% attendance"
            checked={notifications.attendanceAlerts}
            onChange={() => setNotifications(p => ({ ...p, attendanceAlerts: !p.attendanceAlerts }))}
          />
          <SettingRow
            id="cap-notif-perf"
            label="Performance Updates"
            desc="Notifications when score updates are due"
            checked={notifications.performanceUpdates}
            onChange={() => setNotifications(p => ({ ...p, performanceUpdates: !p.performanceUpdates }))}
          />
          <SettingRow
            id="cap-notif-ann"
            label="Team Announcements"
            desc="Receive notifications for new announcements"
            checked={notifications.teamAnnouncements}
            onChange={() => setNotifications(p => ({ ...p, teamAnnouncements: !p.teamAnnouncements }))}
          />
          <SettingRow
            id="cap-notif-coach"
            label="Coach Messages"
            desc="Direct notifications from your coach"
            checked={notifications.coachMessages}
            onChange={() => setNotifications(p => ({ ...p, coachMessages: !p.coachMessages }))}
          />
          <SettingRow
            id="cap-notif-email"
            label="Weekly Email Digest"
            desc="Weekly summary email every Monday"
            checked={notifications.emailDigest}
            onChange={() => setNotifications(p => ({ ...p, emailDigest: !p.emailDigest }))}
          />
        </SectionCard>

        {/* Privacy */}
        <SectionCard title="Privacy & Visibility" icon={<Eye size={14} className="text-cyan-400" />}>
          <SettingRow
            id="cap-priv-profile"
            label="Public Profile"
            desc="Allow team members to see your profile"
            checked={privacy.showProfile}
            onChange={() => setPrivacy(p => ({ ...p, showProfile: !p.showProfile }))}
          />
          <SettingRow
            id="cap-priv-stats"
            label="Show My Stats"
            desc="Display your captain stats on the team page"
            checked={privacy.showStats}
            onChange={() => setPrivacy(p => ({ ...p, showStats: !p.showStats }))}
          />
          <SettingRow
            id="cap-priv-att"
            label="Share Attendance Data"
            desc="Allow Coach to export your attendance records"
            checked={privacy.showAttendance}
            onChange={() => setPrivacy(p => ({ ...p, showAttendance: !p.showAttendance }))}
          />
        </SectionCard>

        {/* About */}
        <div className="lg:col-span-2 bg-dark-800 border border-dark-700 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Globe size={14} className="text-gray-400" /> About
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Module',   value: 'Captain Portal' },
              { label: 'Version',  value: 'v2.0.0' },
              { label: 'System',   value: 'Sports MS' },
              { label: 'Role',     value: 'CAPTAIN (RBAC)' },
            ].map(item => (
              <div key={item.label} className="bg-dark-900/60 border border-dark-700/50 rounded-xl p-3 text-center">
                <p className="text-[10px] text-gray-500">{item.label}</p>
                <p className="text-sm font-semibold text-white mt-0.5">{item.value}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-600 mt-4 text-center">
            Captain Dashboard · Sports Team Management System · Frontend v2.0 · Built with React + TypeScript + Tailwind CSS
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
