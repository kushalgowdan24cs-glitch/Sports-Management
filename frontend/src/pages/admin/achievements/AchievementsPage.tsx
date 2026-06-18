import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Trophy, Plus, Edit, Trash2, Upload, Star } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Modal } from '@/components/common/Modal';
import { Badge, StatusBadge } from '@/components/common/Badge';
import type { Achievement, AchievementFormData, AchievementLevel } from '@/types/achievement.types';
import { ACHIEVEMENT_LEVELS } from '@/utils/constants';
import { formatDate } from '@/utils/dateUtils';
import clsx from 'clsx';

const MOCK_ACHIEVEMENTS: Achievement[] = [
  { id: '1', title: 'District Cricket Champions',   eventName: 'District Tournament 2026', level: 'DISTRICT', date: '2026-03-15', teamName: 'Cricket A',    createdAt: '2026-03-16T10:00:00Z', createdBy: 'coach' },
  { id: '2', title: 'State Kabaddi Runner-Up',       eventName: 'State Games 2026',         level: 'STATE',    date: '2026-02-20', teamName: 'Kabaddi A',    createdAt: '2026-02-21T10:00:00Z', createdBy: 'coach' },
  { id: '3', title: 'Best Batsman Award',            eventName: 'Inter-College T20 2026',   level: 'COLLEGE',  date: '2026-01-10', playerName: 'Arjun Sharma', createdAt: '2026-01-11T10:00:00Z', createdBy: 'coach' },
  { id: '4', title: 'National Volleyball Semifinal', eventName: 'National College Games',   level: 'NATIONAL', date: '2025-11-05', teamName: 'Volleyball A', createdAt: '2025-11-06T10:00:00Z', createdBy: 'coach' },
  { id: '5', title: 'College Football Cup',          eventName: 'Annual Sports Day 2026',   level: 'COLLEGE',  date: '2026-04-25', teamName: 'Football B',   createdAt: '2026-04-26T10:00:00Z', createdBy: 'coach' },
];

const levelEmoji: Record<AchievementLevel, string> = {
  COLLEGE:       '🏫',
  DISTRICT:      '🏙️',
  STATE:         '🗺️',
  NATIONAL:      '🇮🇳',
  INTERNATIONAL: '🌍',
};

const AchievementFormModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  achievement?: Achievement;
  onSave: (data: AchievementFormData) => void;
}> = ({ isOpen, onClose, achievement, onSave }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<AchievementFormData>({
    defaultValues: achievement ? {
      title: achievement.title,
      eventName: achievement.eventName,
      level: achievement.level,
      date: achievement.date,
      description: achievement.description,
    } : {},
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => { reset(); onClose(); }}
      title={achievement ? 'Edit Achievement' : 'Add Achievement'}
      size="lg"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => { reset(); onClose(); }}>Cancel</Button>
          <Button onClick={handleSubmit(onSave)}>Save Achievement</Button>
        </div>
      }
    >
      <div className="space-y-4">
        <Input
          label="Achievement Title"
          required
          placeholder="e.g., District Cricket Champions"
          {...register('title', { required: 'Title is required' })}
          error={errors.title?.message}
        />
        <Input
          label="Event Name"
          required
          placeholder="e.g., District Tournament 2026"
          {...register('eventName', { required: 'Event name is required' })}
          error={errors.eventName?.message}
        />
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Level"
            required
            options={ACHIEVEMENT_LEVELS.map(l => ({ value: l, label: l }))}
            placeholder="Select level"
            {...register('level', { required: 'Level is required' })}
            error={errors.level?.message}
          />
          <Input
            label="Date"
            type="date"
            required
            {...register('date', { required: 'Date is required' })}
            error={errors.date?.message}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
          <textarea
            className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none"
            rows={3}
            placeholder="Describe the achievement..."
            {...register('description')}
          />
        </div>
        {/* Certificate Upload Placeholder */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Certificate</label>
          <div className="border border-dashed border-dark-600 rounded-xl p-4 text-center hover:border-primary-500/50 transition-colors cursor-pointer">
            <Upload size={20} className="text-gray-500 mx-auto mb-2" />
            <p className="text-xs text-gray-500">Upload certificate (PDF, JPG, PNG)</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

const AchievementsPage: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>(MOCK_ACHIEVEMENTS);
  const [addOpen, setAddOpen] = useState(false);
  const [editAch, setEditAch] = useState<Achievement | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Achievement | null>(null);
  const [levelFilter, setLevelFilter] = useState('');

  const filtered = achievements.filter(a => !levelFilter || a.level === levelFilter);

  const handleSave = (data: AchievementFormData) => {
    if (editAch) {
      setAchievements(prev => prev.map(a => a.id === editAch.id ? { ...a, ...data } : a));
      setEditAch(null);
    } else {
      const na: Achievement = {
        id: Date.now().toString(),
        ...data,
        createdAt: new Date().toISOString(),
        createdBy: 'coach',
      };
      setAchievements(prev => [na, ...prev]);
      setAddOpen(false);
    }
  };

  const levelCounts = ACHIEVEMENT_LEVELS.reduce((acc, l) => {
    acc[l] = achievements.filter(a => a.level === l).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Achievements"
        subtitle="Track team and player achievements"
        icon={<Trophy size={22} />}
        iconBg="bg-yellow-500/20"
        breadcrumb={[{ label: 'Admin' }, { label: 'Achievements' }]}
        actions={
          <Button size="sm" leftIcon={<Plus size={14} />} onClick={() => setAddOpen(true)}>
            Add Achievement
          </Button>
        }
      />

      {/* Level Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {ACHIEVEMENT_LEVELS.map(level => (
          <button
            key={level}
            onClick={() => setLevelFilter(levelFilter === level ? '' : level)}
            className={clsx(
              'bg-dark-800 border rounded-2xl p-3 text-center transition-all hover:-translate-y-0.5',
              levelFilter === level ? 'border-primary-500/50 bg-primary-500/10' : 'border-dark-700',
            )}
          >
            <div className="text-2xl mb-1">{levelEmoji[level]}</div>
            <p className="text-xl font-bold text-white">{levelCounts[level] ?? 0}</p>
            <p className="text-[10px] text-gray-500">{level}</p>
          </button>
        ))}
      </div>

      {/* Achievement Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(achievement => (
          <div
            key={achievement.id}
            className="bg-dark-800 border border-dark-700 rounded-2xl p-5 hover:border-dark-600 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{levelEmoji[achievement.level]}</div>
                <div>
                  <p className="font-semibold text-white">{achievement.title}</p>
                  <p className="text-xs text-gray-500">{achievement.eventName}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setEditAch(achievement)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-primary-400 hover:bg-primary-400/10 transition-colors"
                >
                  <Edit size={14} />
                </button>
                <button
                  onClick={() => setDeleteConfirm(achievement)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <StatusBadge status={achievement.level} />
              {achievement.teamName && <Badge variant="gray">{achievement.teamName}</Badge>}
              {achievement.playerName && <Badge variant="info">{achievement.playerName}</Badge>}
              <span className="text-xs text-gray-500">{formatDate(achievement.date)}</span>
            </div>
            {achievement.description && (
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">{achievement.description}</p>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-2 text-center py-16 text-gray-500">
            <Star size={40} className="mx-auto mb-3 opacity-20" />
            <p className="text-sm">No achievements recorded yet.</p>
          </div>
        )}
      </div>

      <AchievementFormModal isOpen={addOpen}    onClose={() => setAddOpen(false)}  onSave={handleSave} />
      <AchievementFormModal isOpen={!!editAch}  onClose={() => setEditAch(null)}   onSave={handleSave} achievement={editAch ?? undefined} />

      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Achievement"
        size="sm"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => { setAchievements(p => p.filter(a => a.id !== deleteConfirm?.id)); setDeleteConfirm(null); }}>
              Delete
            </Button>
          </div>
        }
      >
        <p className="text-sm text-gray-300">Delete achievement <strong className="text-white">{deleteConfirm?.title}</strong>?</p>
      </Modal>
    </div>
  );
};

export default AchievementsPage;
