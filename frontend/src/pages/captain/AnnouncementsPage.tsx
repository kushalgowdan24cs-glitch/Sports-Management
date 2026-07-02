import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Megaphone, Plus, Send, X, ChevronDown, Bell } from 'lucide-react';
import { captainService } from '@/services/captain/captainService';
import type { CreateAnnouncementForm } from '@/types/captain.types';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';

const CAT_COLORS: Record<string, string> = {
  URGENT:   'bg-red-500/10 border-red-500/20 text-red-400',
  MATCH:    'bg-amber-500/10 border-amber-500/20 text-amber-400',
  PRACTICE: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
  FITNESS:  'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
  GENERAL:  'bg-gray-500/10 border-gray-500/20 text-gray-400',
};

const CAT_ICONS: Record<string, string> = {
  URGENT: '🚨', MATCH: '🏆', PRACTICE: '🏃', FITNESS: '💪', GENERAL: '📢',
};

const AnnouncementsPage: React.FC = () => {
  const { data: announcements, isLoading } = useQuery({ queryKey: ['captain-announcements'], queryFn: captainService.getAnnouncements });

  const [showForm, setShowForm]     = useState(false);
  const [saved, setSaved]           = useState(false);
  const [filterCat, setFilterCat]   = useState('ALL');
  const [notification, setNotification] = useState('');
  const [notifSent, setNotifSent]   = useState(false);

  const { register, handleSubmit, reset } = useForm<CreateAnnouncementForm>({
    defaultValues: { title: '', message: '', category: 'PRACTICE', targetAudience: 'TEAM' },
  });

  const onSubmit = async (data: CreateAnnouncementForm) => {
    await new Promise(r => setTimeout(r, 600));
    console.log('Announcement created:', data);
    setSaved(true);
    reset();
    setTimeout(() => { setSaved(false); setShowForm(false); }, 2000);
  };

  const sendNotification = async () => {
    if (!notification.trim()) return;
    await new Promise(r => setTimeout(r, 400));
    setNotifSent(true);
    setNotification('');
    setTimeout(() => setNotifSent(false), 3000);
  };

  const filtered = (announcements ?? []).filter(a =>
    filterCat === 'ALL' || a.category === filterCat
  );

  const categories = ['ALL', 'URGENT', 'MATCH', 'PRACTICE', 'FITNESS', 'GENERAL'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Announcements</h1>
          <p className="text-sm text-gray-400 mt-1">Create and manage team announcements and notifications</p>
        </div>
        <button onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors">
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Cancel' : 'New Announcement'}
        </button>
      </div>

      {/* Quick Notification */}
      <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5">
        <p className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <Bell size={14} className="text-yellow-400" /> Quick Team Notification
        </p>
        {notifSent && (
          <div className="mb-3 px-3 py-2 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-xs text-emerald-400">
            ✓ Notification sent to all team members!
          </div>
        )}
        <div className="flex gap-3">
          <input type="text" placeholder="Type a quick notification message..." value={notification}
            onChange={e => setNotification(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendNotification()}
            className="flex-1 bg-dark-900 border border-dark-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
          />
          <button onClick={sendNotification}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/40 transition-colors text-sm">
            <Send size={14} /> Send
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {['Practice Session at 6 AM', 'Match Tomorrow at 10 AM', 'Fitness Assessment Today', 'Team Meeting at 5 PM'].map(q => (
            <button key={q} onClick={() => setNotification(q)}
              className="text-[11px] px-3 py-1 rounded-full bg-dark-700 text-gray-400 hover:text-white hover:bg-dark-600 transition-colors border border-dark-600">
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Create Announcement Form */}
      {showForm && (
        <div className="bg-dark-800 border border-emerald-500/30 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Megaphone size={14} className="text-emerald-400" /> Create Announcement
          </h3>
          {saved && (
            <div className="px-4 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-sm text-emerald-400">
              ✓ Announcement published to team!
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Title <span className="text-red-400">*</span></label>
                <input {...register('title', { required: true })}
                  placeholder="Announcement title..."
                  className="w-full bg-dark-900 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Category</label>
                  <select {...register('category')}
                    className="w-full bg-dark-900 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white appearance-none focus:outline-none focus:border-emerald-500">
                    {['PRACTICE', 'MATCH', 'FITNESS', 'URGENT', 'GENERAL'].map(c => <option key={c}>{c}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-3 bottom-3 text-gray-500 pointer-events-none" />
                </div>
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Audience</label>
                  <select {...register('targetAudience')}
                    className="w-full bg-dark-900 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white appearance-none focus:outline-none focus:border-emerald-500">
                    <option value="TEAM">Team Only</option>
                    <option value="ALL">All</option>
                  </select>
                  <ChevronDown size={12} className="absolute right-3 bottom-3 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Message <span className="text-red-400">*</span></label>
              <textarea {...register('message', { required: true })} rows={4}
                placeholder="Write your announcement message..."
                className="w-full bg-dark-900 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => { reset(); setShowForm(false); }}
                className="px-4 py-2.5 rounded-xl bg-dark-700 border border-dark-600 text-gray-400 hover:text-white text-sm transition-colors">
                Cancel
              </button>
              <button type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors">
                <Send size={14} /> Publish Announcement
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter + List */}
      <div className="space-y-4">
        {/* Category Filters */}
        <div className="flex gap-2 flex-wrap">
          {categories.map(c => (
            <button key={c} onClick={() => setFilterCat(c)}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
                filterCat === c
                  ? 'bg-emerald-600/20 border-emerald-500/40 text-emerald-400'
                  : 'bg-dark-800 border-dark-700 text-gray-400 hover:text-white',
              )}>
              {c !== 'ALL' && <span>{CAT_ICONS[c]}</span>}
              {c}
            </button>
          ))}
        </div>

        {/* Announcements List */}
        {isLoading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-24 bg-dark-800 rounded-2xl animate-pulse" />)}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(a => (
              <div key={a.id} className="bg-dark-800 border border-dark-700 rounded-2xl p-5 hover:border-dark-600 transition-colors">
                <div className="flex items-start gap-4">
                  <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg border', CAT_COLORS[a.category] ?? CAT_COLORS.GENERAL)}>
                    {CAT_ICONS[a.category]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <h4 className="text-sm font-semibold text-white">{a.title}</h4>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={clsx('text-[9px] font-bold px-2 py-0.5 rounded-full border', CAT_COLORS[a.category] ?? CAT_COLORS.GENERAL)}>
                          {a.category}
                        </span>
                        <span className="text-[10px] text-gray-500">
                          {new Date(a.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">{a.message}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] text-gray-600">By {a.createdBy}</span>
                      <span className="text-[10px] text-gray-600">· {a.targetAudience === 'TEAM' ? 'Team only' : 'All members'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="py-12 text-center">
                <Megaphone size={32} className="mx-auto text-dark-600 mb-3" />
                <p className="text-gray-500">No announcements in this category</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementsPage;
