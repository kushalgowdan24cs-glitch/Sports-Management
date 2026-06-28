import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Megaphone, Plus, X, CheckCircle, AlertTriangle, Swords, Activity, ChevronDown } from 'lucide-react';
import { vcDashboardService } from '@/services/vice-captain/vcDashboardService';
import type { VCAnnouncement, CreateAnnouncementForm } from '@/types/vice-captain.types';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import clsx from 'clsx';

const categoryConfig: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  URGENT:   { color: 'bg-red-500/10 border-red-500/25 text-red-400',          icon: <AlertTriangle size={11} />, label: 'Urgent' },
  MATCH:    { color: 'bg-amber-500/10 border-amber-500/25 text-amber-400',    icon: <Swords size={11} />,        label: 'Match' },
  PRACTICE: { color: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400', icon: <CheckCircle size={11} />, label: 'Practice' },
  FITNESS:  { color: 'bg-cyan-500/10 border-cyan-500/25 text-cyan-400',       icon: <Activity size={11} />,      label: 'Fitness' },
  GENERAL:  { color: 'bg-gray-500/10 border-gray-500/25 text-gray-400',       icon: <Megaphone size={11} />,     label: 'General' },
};

const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3_600_000);
  const d = Math.floor(diff / 86_400_000);
  if (h < 1) return 'Just now';
  if (h < 24) return `${h}h ago`;
  return `${d}d ago`;
};

const AnnouncementsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: announcements = [], isLoading } = useQuery({
    queryKey: ['vc-announcements'],
    queryFn: vcDashboardService.getAnnouncements,
  });
  const [showForm, setShowForm] = useState(false);
  const [filterCat, setFilterCat] = useState<string>('ALL');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateAnnouncementForm>({
    defaultValues: { category: 'GENERAL', targetAudience: 'TEAM' },
  });

  const mutation = useMutation({
    mutationFn: vcDashboardService.createAnnouncement,
    onSuccess: (newAnn) => {
      queryClient.setQueryData<VCAnnouncement[]>(['vc-announcements'], old => [newAnn, ...(old ?? [])]);
      setShowForm(false);
      reset();
    },
  });

  const filtered = announcements.filter(a => filterCat === 'ALL' || a.category === filterCat);
  const categories = ['ALL', 'URGENT', 'MATCH', 'PRACTICE', 'FITNESS', 'GENERAL'];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Announcements</h1>
          <p className="text-sm text-gray-400 mt-1">Create and manage team announcements</p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors shadow-glow-primary"
          id="vc-create-announcement-btn"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Cancel' : 'New Announcement'}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-dark-800 border border-violet-500/30 rounded-2xl p-6 animate-slide-up">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Megaphone size={14} className="text-violet-400" /> Create Team Announcement
          </h3>
          <form onSubmit={handleSubmit(d => mutation.mutate(d))} className="space-y-4">
            <Input
              label="Title" id="ann-title" placeholder="e.g., Practice Session Today"
              {...register('title', { required: 'Title is required' })}
              error={errors.title?.message}
            />
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Message</label>
              <textarea
                {...register('message', { required: true })} rows={4}
                placeholder="Write your announcement message here..."
                className="w-full bg-dark-900 border border-dark-700 rounded-xl px-3 py-2 text-sm text-white
                           focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 resize-none placeholder-gray-600"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Category</label>
                <div className="relative">
                  <select {...register('category')}
                    className="w-full bg-dark-900 border border-dark-700 rounded-xl px-3 pr-8 py-2.5 text-sm text-white appearance-none
                               focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30">
                    {['GENERAL','PRACTICE','MATCH','FITNESS','URGENT'].map(c => <option key={c}>{c}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Target</label>
                <div className="relative">
                  <select {...register('targetAudience')}
                    className="w-full bg-dark-900 border border-dark-700 rounded-xl px-3 pr-8 py-2.5 text-sm text-white appearance-none
                               focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30">
                    <option value="TEAM">Team Members</option>
                    <option value="ALL">All</option>
                  </select>
                  <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button type="submit" size="sm" disabled={mutation.isPending}>
                {mutation.isPending ? 'Sending...' : 'Post Announcement'}
              </Button>
              <button type="button" onClick={() => { setShowForm(false); reset(); }}
                className="text-xs text-gray-400 hover:text-white transition-colors">Discard</button>
            </div>
            {mutation.isError && (
              <p className="text-xs text-red-400">Failed to post announcement. Please try again.</p>
            )}
          </form>
        </div>
      )}

      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map(c => (
          <button key={c} onClick={() => setFilterCat(c)}
            className={clsx(
              'px-3 py-1.5 rounded-xl text-xs font-medium transition-all',
              filterCat === c
                ? 'bg-violet-600 text-white shadow-glow-primary'
                : 'bg-dark-800 text-gray-400 border border-dark-700 hover:border-violet-500/40 hover:text-white',
            )}
          >{c === 'ALL' ? 'All Categories' : c}</button>
        ))}
      </div>

      {/* Announcement list */}
      <div className="space-y-3">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 bg-dark-800 border border-dark-700 rounded-2xl animate-pulse" />)
          : filtered.map(a => {
            const cfg = categoryConfig[a.category] ?? categoryConfig.GENERAL;
            return (
              <div key={a.id} className="bg-dark-800 border border-dark-700 rounded-2xl p-5 hover:border-violet-500/20 transition-all group">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={clsx(
                      'flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold shrink-0',
                      cfg.color,
                    )}>
                      {cfg.icon} {cfg.label}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white">{a.title}</p>
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed">{a.message}</p>
                      <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-600">
                        <span>{timeAgo(a.createdAt)}</span>
                        <span>·</span>
                        <span>{a.createdBy}</span>
                        <span>·</span>
                        <span>👥 {a.targetAudience === 'ALL' ? 'Everyone' : 'Team'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        }
        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-16 text-gray-500 text-sm">No announcements in this category.</div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementsPage;
