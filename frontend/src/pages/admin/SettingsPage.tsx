import React from 'react';
import { Settings, Bell, Shield, Palette, Database, Globe } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { useTheme } from '@/hooks/useTheme';
import clsx from 'clsx';

const SettingsPage: React.FC = () => {
  const { theme, toggle } = useTheme();

  const settingsSections = [
    {
      icon: Palette,
      title: 'Appearance',
      description: 'Customize the look and feel of the dashboard',
      color: 'text-violet-400',
      bg: 'bg-violet-400/10',
      content: (
        <div className="flex items-center justify-between py-3 border-b border-dark-700/50">
          <div>
            <p className="text-sm font-medium text-white">Dark Mode</p>
            <p className="text-xs text-gray-500">Switch between dark and light themes</p>
          </div>
          <button
            onClick={toggle}
            className={clsx(
              'relative w-12 h-6 rounded-full transition-all duration-300',
              theme === 'dark' ? 'bg-primary-600' : 'bg-dark-600',
            )}
          >
            <span className={clsx(
              'absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow',
              theme === 'dark' ? 'left-7' : 'left-1',
            )} />
          </button>
        </div>
      ),
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Configure notification preferences',
      color: 'text-pink-400',
      bg: 'bg-pink-400/10',
      content: (
        <div className="space-y-3">
          {[
            { label: 'Match Reminders',    desc: 'Get notified before upcoming matches' },
            { label: 'Attendance Alerts',  desc: 'Alert when attendance drops below threshold' },
            { label: 'Performance Reports', desc: 'Weekly performance summary emails' },
          ].map(n => (
            <div key={n.label} className="flex items-center justify-between py-2 border-b border-dark-700/50 last:border-0">
              <div>
                <p className="text-sm font-medium text-white">{n.label}</p>
                <p className="text-xs text-gray-500">{n.desc}</p>
              </div>
              <div className="w-10 h-5 rounded-full bg-primary-600 relative cursor-pointer">
                <span className="absolute right-1 top-0.5 w-4 h-4 bg-white rounded-full shadow" />
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      icon: Shield,
      title: 'Security',
      description: 'Manage access and security settings',
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
      content: (
        <div className="space-y-2 text-sm text-gray-400">
          <p>• Two-factor authentication: <span className="text-amber-400">Not configured</span></p>
          <p>• Session timeout: <span className="text-white">30 minutes</span></p>
          <p>• Last login: <span className="text-white">Today at 9:02 AM</span></p>
        </div>
      ),
    },
    {
      icon: Database,
      title: 'Data & Storage',
      description: 'Manage data exports and storage',
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
      content: (
        <div className="space-y-2 text-sm text-gray-400">
          <p>• Storage used: <span className="text-white">2.4 GB</span> of 10 GB</p>
          <p>• Last backup: <span className="text-white">2 hours ago</span></p>
        </div>
      ),
    },
    {
      icon: Globe,
      title: 'System',
      description: 'API and integration settings',
      color: 'text-cyan-400',
      bg: 'bg-cyan-400/10',
      content: (
        <div className="space-y-2 text-sm text-gray-400">
          <p>• API Base URL: <span className="text-white font-mono text-xs">http://localhost:8080/api/v1</span></p>
          <p>• Version: <span className="text-white">1.0.0</span></p>
          <p>• Environment: <span className="text-emerald-400">Development</span></p>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Settings"
        subtitle="Manage system preferences and configurations"
        icon={<Settings size={22} />}
        breadcrumb={[{ label: 'Admin' }, { label: 'Settings' }]}
      />

      <div className="space-y-4">
        {settingsSections.map(section => (
          <div key={section.title} className="bg-dark-800 border border-dark-700 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className={clsx('p-2.5 rounded-xl', section.bg)}>
                <section.icon size={18} className={section.color} />
              </div>
              <div>
                <h3 className="font-semibold text-white">{section.title}</h3>
                <p className="text-xs text-gray-500">{section.description}</p>
              </div>
            </div>
            {section.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsPage;
