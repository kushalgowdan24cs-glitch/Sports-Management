import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Bell, Send, Plus, Trash2, Users, User, Megaphone, Check, CheckCheck } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Modal } from '@/components/common/Modal';
import { Badge } from '@/components/common/Badge';
import type { Notification, AnnouncementFormData } from '@/types/notification.types';
import { formatRelativeTime } from '@/utils/dateUtils';
import clsx from 'clsx';

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', title: 'Mandatory Training Session',     body: 'All teams must attend the mandatory fitness training this Saturday at 6 AM.',               type: 'SYSTEM',       target: 'ALL',      isRead: false, createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), createdBy: 'c1', createdByName: 'Coach Ramesh' },
  { id: '2', title: 'Cricket Team Practice',          body: 'Cricket team practice rescheduled to 5 PM tomorrow.',                                      type: 'ATTENDANCE',   target: 'TEAM',     teamName: 'Cricket A', isRead: false, createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(), createdBy: 'c1', createdByName: 'Coach Ramesh' },
  { id: '3', title: 'Match Schedule Update',          body: 'Inter-college tournament match against SJCE confirmed for June 18.',                        type: 'MATCH',        target: 'ALL',      isRead: true, createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), createdBy: 'c1', createdByName: 'Coach Ramesh' },
  { id: '4', title: 'Performance Review',             body: 'Performance scores have been updated for all players. Check your profile.',                  type: 'PERFORMANCE',  target: 'ALL',      isRead: true, createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(), createdBy: 'c1', createdByName: 'Coach Ramesh' },
  { id: '5', title: 'Kabaddi Team Practice Reminder', body: 'Please don\'t forget evening practice. All Kabaddi players must be present.',              type: 'ATTENDANCE',   target: 'TEAM',     teamName: 'Kabaddi A', isRead: true, createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(), createdBy: 'c1', createdByName: 'Coach Ramesh' },
];

const typeConfig: Record<string, { color: string; bg: string; icon: React.ComponentType<any> }> = {
  MATCH:        { color: 'text-amber-400',   bg: 'bg-amber-400/10',   icon: Bell },
  ATTENDANCE:   { color: 'text-emerald-400', bg: 'bg-emerald-400/10', icon: Users },
  PERFORMANCE:  { color: 'text-violet-400',  bg: 'bg-violet-400/10',  icon: Bell },
  SYSTEM:       { color: 'text-blue-400',    bg: 'bg-blue-400/10',    icon: Megaphone },
  ANNOUNCEMENT: { color: 'text-primary-400', bg: 'bg-primary-400/10', icon: Megaphone },
};

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [createOpen, setCreateOpen] = useState(false);
  const [tab, setTab] = useState<'all' | 'unread' | 'team' | 'individual'>('all');

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<AnnouncementFormData>({
    defaultValues: { target: 'ALL', type: 'ANNOUNCEMENT' },
  });

  const target = watch('target');
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const displayed = tab === 'unread'     ? notifications.filter(n => !n.isRead) :
                    tab === 'team'       ? notifications.filter(n => n.target === 'TEAM') :
                    tab === 'individual' ? notifications.filter(n => n.target === 'INDIVIDUAL') :
                    notifications;

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotif = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const onSend = (data: AnnouncementFormData) => {
    const newNotif: Notification = {
      id: Date.now().toString(),
      ...data,
      isRead: false,
      createdAt: new Date().toISOString(),
      createdBy: 'coach',
      createdByName: 'Coach Ramesh',
    };
    setNotifications(prev => [newNotif, ...prev]);
    reset();
    setCreateOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications & Announcements"
        subtitle={`${unreadCount} unread notifications`}
        icon={<Bell size={22} />}
        iconBg="bg-pink-500/20"
        breadcrumb={[{ label: 'Admin' }, { label: 'Notifications' }]}
        actions={
          <>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" leftIcon={<CheckCheck size={14} />} onClick={markAllRead}>
                Mark all read
              </Button>
            )}
            <Button size="sm" leftIcon={<Plus size={14} />} onClick={() => setCreateOpen(true)}>
              Create Announcement
            </Button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Sent',  value: notifications.length,                                    color: 'text-white' },
          { label: 'Unread',      value: unreadCount,                                             color: 'text-red-400' },
          { label: 'Team Notifs', value: notifications.filter(n => n.target === 'TEAM').length,   color: 'text-blue-400' },
          { label: 'Broadcasts',  value: notifications.filter(n => n.target === 'ALL').length,    color: 'text-emerald-400' },
        ].map(s => (
          <div key={s.label} className="bg-dark-800 border border-dark-700 rounded-2xl p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-dark-800 border border-dark-700 rounded-xl p-1 w-fit flex-wrap">
        {[
          { key: 'all',        label: 'All' },
          { key: 'unread',     label: `Unread (${unreadCount})` },
          { key: 'team',       label: 'Team' },
          { key: 'individual', label: 'Individual' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as typeof tab)}
            className={clsx(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all',
              tab === t.key
                ? 'bg-primary-600/30 text-primary-300 border border-primary-500/30'
                : 'text-gray-400 hover:text-white',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="space-y-2">
        {displayed.map(notif => {
          const config = typeConfig[notif.type] ?? typeConfig.ANNOUNCEMENT!;
          const Icon = config.icon;
          return (
            <div
              key={notif.id}
              className={clsx(
                'bg-dark-800 border rounded-2xl p-4 transition-all',
                !notif.isRead ? 'border-primary-500/30' : 'border-dark-700',
              )}
            >
              <div className="flex items-start gap-3">
                <div className={clsx('p-2.5 rounded-xl shrink-0', config.bg)}>
                  <Icon size={16} className={config.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={clsx('text-sm font-semibold', !notif.isRead ? 'text-white' : 'text-gray-300')}>
                        {notif.title}
                      </p>
                      {!notif.isRead && <span className="w-2 h-2 bg-primary-500 rounded-full shrink-0 animate-pulse-slow" />}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {!notif.isRead && (
                        <button
                          onClick={() => markRead(notif.id)}
                          className="p-1 rounded text-gray-500 hover:text-emerald-400 transition-colors"
                          title="Mark as read"
                        >
                          <Check size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotif(notif.id)}
                        className="p-1 rounded text-gray-500 hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed mb-2">{notif.body}</p>
                  <div className="flex items-center gap-2 flex-wrap text-[10px] text-gray-600">
                    <span>{formatRelativeTime(notif.createdAt)}</span>
                    <span>·</span>
                    <span>{notif.createdByName}</span>
                    <span>·</span>
                    {notif.target === 'ALL'  && <Badge variant="gray" size="sm">All Users</Badge>}
                    {notif.target === 'TEAM' && <Badge variant="info" size="sm">{notif.teamName ?? 'Team'}</Badge>}
                    {notif.target === 'INDIVIDUAL' && <Badge variant="purple" size="sm">Individual</Badge>}
                    <Badge variant={notif.type === 'MATCH' ? 'warning' : notif.type === 'ATTENDANCE' ? 'success' : notif.type === 'PERFORMANCE' ? 'purple' : 'primary'} size="sm">
                      {notif.type}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {displayed.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <Bell size={40} className="mx-auto mb-3 opacity-20" />
            <p className="text-sm">No notifications here.</p>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={createOpen}
        onClose={() => { reset(); setCreateOpen(false); }}
        title="Create Announcement"
        size="lg"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => { reset(); setCreateOpen(false); }}>Cancel</Button>
            <Button leftIcon={<Send size={14} />} onClick={handleSubmit(onSend)}>Send</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Title"
            required
            placeholder="Announcement title..."
            {...register('title', { required: 'Title is required' })}
            error={errors.title?.message}
          />
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Message <span className="text-red-400">*</span>
            </label>
            <textarea
              className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none"
              rows={4}
              placeholder="Write your announcement..."
              {...register('body', { required: 'Message is required' })}
            />
            {errors.body && <p className="text-xs text-red-400 mt-0.5">{errors.body.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Type"
              options={[
                { value: 'ANNOUNCEMENT', label: 'Announcement' },
                { value: 'MATCH',        label: 'Match' },
                { value: 'ATTENDANCE',   label: 'Attendance' },
                { value: 'PERFORMANCE',  label: 'Performance' },
                { value: 'SYSTEM',       label: 'System' },
              ]}
              {...register('type')}
            />
            <Select
              label="Send To"
              options={[
                { value: 'ALL',        label: 'Everyone' },
                { value: 'TEAM',       label: 'Specific Team' },
                { value: 'INDIVIDUAL', label: 'Individual Player' },
              ]}
              {...register('target')}
            />
          </div>
          {target === 'TEAM' && (
            <Select
              label="Select Team"
              options={[
                { value: 't1', label: 'Cricket A' },
                { value: 't2', label: 'Football B' },
                { value: 't3', label: 'Kabaddi A' },
                { value: 't4', label: 'Volleyball A' },
              ]}
              placeholder="Choose team"
              {...register('teamId')}
            />
          )}
          {target === 'INDIVIDUAL' && (
            <Input
              label="Player ID"
              placeholder="Enter player ID"
              {...register('recipientId')}
            />
          )}
        </div>
      </Modal>
    </div>
  );
};

export default NotificationsPage;
