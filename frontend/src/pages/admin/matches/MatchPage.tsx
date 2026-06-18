import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Edit, Trash2, Calendar, MapPin, Trophy, Image, Swords } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Modal } from '@/components/common/Modal';
import { Badge, StatusBadge } from '@/components/common/Badge';
import { MatchStatsChart } from '@/components/charts/MatchStatsChart';
import type { Match, MatchFormData } from '@/types/match.types';
import { formatDate } from '@/utils/dateUtils';
import clsx from 'clsx';

const MOCK_MATCHES: Match[] = [
  { id: '1', teamId: 't1', teamName: 'Cricket A', tournamentName: 'Inter-College T20', opponentName: 'SJCE',  matchDate: '2026-06-10', venue: 'Home Ground',  matchType: 'TOURNAMENT', status: 'COMPLETED', teamScore: 187, opponentScore: 162, result: 'WIN',  bestPlayerName: 'Arjun Sharma', createdBy: 'coach1', createdAt: '2026-05-30T10:00:00Z' },
  { id: '2', teamId: 't2', teamName: 'Football B', opponentName: 'NIT-K', matchDate: '2026-06-12', venue: 'NIT Campus',   matchType: 'LEAGUE',     status: 'COMPLETED', teamScore: 2,   opponentScore: 3,   result: 'LOSS', bestPlayerName: 'Kiran Patel',  createdBy: 'coach1', createdAt: '2026-06-01T10:00:00Z' },
  { id: '3', teamId: 't3', teamName: 'Kabaddi A',  opponentName: 'RVCE', matchDate: '2026-06-14', venue: 'Indoor Hall',  matchType: 'FRIENDLY',   status: 'COMPLETED', teamScore: 38,  opponentScore: 38,  result: 'DRAW', bestPlayerName: 'Suresh Kumar', createdBy: 'coach1', createdAt: '2026-06-05T10:00:00Z' },
  { id: '4', teamId: 't1', teamName: 'Cricket A', tournamentName: 'Inter-College T20', opponentName: 'PESIT', matchDate: '2026-06-18', venue: 'Home Ground',  matchType: 'TOURNAMENT', status: 'SCHEDULED',                                           createdBy: 'coach1', createdAt: '2026-06-08T10:00:00Z' },
  { id: '5', teamId: 't2', teamName: 'Football B', opponentName: 'PESCE', matchDate: '2026-06-20', venue: 'Home Ground',  matchType: 'LEAGUE',     status: 'SCHEDULED',                                           createdBy: 'coach1', createdAt: '2026-06-08T10:00:00Z' },
];

const MatchFormModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  match?: Match;
  onSave: (data: MatchFormData) => void;
}> = ({ isOpen, onClose, match, onSave }) => {
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<MatchFormData>({
    defaultValues: match ? {
      teamId: match.teamId,
      tournamentName: match.tournamentName,
      opponentName: match.opponentName,
      matchDate: match.matchDate,
      venue: match.venue,
      matchType: match.matchType,
      status: match.status,
      teamScore: match.teamScore,
      opponentScore: match.opponentScore,
      result: match.result,
      notes: match.notes,
    } : { status: 'SCHEDULED', matchType: 'FRIENDLY' },
  });

  const status = watch('status');

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => { reset(); onClose(); }}
      title={match ? 'Edit Match' : 'Schedule New Match'}
      size="2xl"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => { reset(); onClose(); }}>Cancel</Button>
          <Button onClick={handleSubmit(onSave)}>{match ? 'Save Changes' : 'Schedule Match'}</Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Tournament Name" placeholder="Optional" {...register('tournamentName')} wrapperClassName="sm:col-span-2" />
        <Input
          label="Opponent Team"
          required
          {...register('opponentName', { required: 'Opponent is required' })}
          error={errors.opponentName?.message}
        />
        <Input
          label="Match Date"
          type="date"
          required
          {...register('matchDate', { required: 'Date is required' })}
          error={errors.matchDate?.message}
        />
        <Input
          label="Venue"
          required
          {...register('venue', { required: 'Venue is required' })}
          error={errors.venue?.message}
        />
        <Select
          label="Match Type"
          options={[
            { value: 'FRIENDLY',   label: 'Friendly' },
            { value: 'LEAGUE',     label: 'League' },
            { value: 'TOURNAMENT', label: 'Tournament' },
          ]}
          {...register('matchType')}
        />
        <Select
          label="Status"
          options={[
            { value: 'SCHEDULED',    label: 'Scheduled' },
            { value: 'IN_PROGRESS',  label: 'In Progress' },
            { value: 'COMPLETED',    label: 'Completed' },
            { value: 'CANCELLED',    label: 'Cancelled' },
          ]}
          {...register('status')}
        />
        {status === 'COMPLETED' && (
          <>
            <Input label="Our Score"      type="number" {...register('teamScore', { valueAsNumber: true })} />
            <Input label="Opponent Score" type="number" {...register('opponentScore', { valueAsNumber: true })} />
            <Select
              label="Result"
              options={[
                { value: 'WIN',  label: 'Win' },
                { value: 'LOSS', label: 'Loss' },
                { value: 'DRAW', label: 'Draw' },
              ]}
              placeholder="Select result"
              {...register('result')}
              wrapperClassName="sm:col-span-2"
            />
          </>
        )}
        <Input label="Team ID" placeholder="Team identifier" {...register('teamId')} wrapperClassName="sm:col-span-2" />
      </div>
    </Modal>
  );
};

const MatchPage: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>(MOCK_MATCHES);
  const [addOpen, setAddOpen] = useState(false);
  const [editMatch, setEditMatch] = useState<Match | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Match | null>(null);
  const [tab, setTab] = useState<'all' | 'upcoming' | 'completed' | 'gallery'>('all');

  const completed = matches.filter(m => m.status === 'COMPLETED');
  const upcoming  = matches.filter(m => m.status === 'SCHEDULED' || m.status === 'IN_PROGRESS');
  const wins   = completed.filter(m => m.result === 'WIN').length;
  const losses = completed.filter(m => m.result === 'LOSS').length;
  const draws  = completed.filter(m => m.result === 'DRAW').length;

  const displayed = tab === 'upcoming'  ? upcoming :
                    tab === 'completed' ? completed : matches;

  const handleSave = (data: MatchFormData) => {
    if (editMatch) {
      setMatches(prev => prev.map(m => m.id === editMatch.id ? { ...m, ...data } : m));
      setEditMatch(null);
    } else {
      const nm: Match = {
        id: Date.now().toString(),
        ...data,
        teamName: 'TBD',
        createdBy: 'coach',
        createdAt: new Date().toISOString(),
      };
      setMatches(prev => [nm, ...prev]);
      setAddOpen(false);
    }
  };

  const resultColor = (result?: string) =>
    result === 'WIN' ? 'text-emerald-400' : result === 'LOSS' ? 'text-red-400' : 'text-gray-400';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Match Management"
        subtitle={`${matches.length} total matches · ${upcoming.length} upcoming`}
        icon={<Swords size={22} />}
        iconBg="bg-amber-500/20"
        breadcrumb={[{ label: 'Admin' }, { label: 'Matches' }]}
        actions={
          <Button size="sm" leftIcon={<Plus size={14} />} onClick={() => setAddOpen(true)}>
            Schedule Match
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total',    value: matches.length,   color: 'text-white' },
            { label: 'Wins',     value: wins,             color: 'text-emerald-400' },
            { label: 'Losses',   value: losses,           color: 'text-red-400' },
            { label: 'Draws',    value: draws,            color: 'text-gray-400' },
          ].map(s => (
            <div key={s.label} className="bg-dark-800 border border-dark-700 rounded-2xl p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-4">
          <p className="text-sm font-semibold text-white mb-2">Win/Loss Distribution</p>
          <MatchStatsChart wins={wins} losses={losses} draws={draws} height={120} />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-dark-800 border border-dark-700 rounded-xl p-1 w-fit">
        {[
          { key: 'all',       label: 'All Matches' },
          { key: 'upcoming',  label: 'Upcoming' },
          { key: 'completed', label: 'Completed' },
          { key: 'gallery',   label: 'Gallery' },
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

      {/* Match Cards */}
      {tab !== 'gallery' && (
        <div className="space-y-3">
          {displayed.map(match => (
            <div
              key={match.id}
              className="bg-dark-800 border border-dark-700 rounded-2xl p-5 hover:border-dark-600 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {match.tournamentName && (
                      <span className="text-xs px-2 py-0.5 bg-primary-500/20 text-primary-300 rounded-full border border-primary-500/30">
                        {match.tournamentName}
                      </span>
                    )}
                    <StatusBadge status={match.status} />
                    <Badge variant={match.matchType === 'TOURNAMENT' ? 'primary' : match.matchType === 'LEAGUE' ? 'info' : 'gray'}>
                      {match.matchType}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-0.5">{match.teamName}</p>
                      <p className={clsx('text-2xl font-bold', match.result ? resultColor(match.result) : 'text-white')}>
                        {match.teamScore ?? '—'}
                      </p>
                    </div>
                    <div className="flex flex-col items-center">
                      <Swords size={16} className="text-gray-500" />
                      {match.result && (
                        <span className={clsx('text-xs font-bold mt-1', resultColor(match.result))}>
                          {match.result}
                        </span>
                      )}
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-0.5">{match.opponentName}</p>
                      <p className="text-2xl font-bold text-white">{match.opponentScore ?? '—'}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Calendar size={12} />{formatDate(match.matchDate)}</span>
                    <span className="flex items-center gap-1"><MapPin size={12} />{match.venue}</span>
                    {match.bestPlayerName && (
                      <span className="flex items-center gap-1"><Trophy size={12} className="text-yellow-400" />Best: {match.bestPlayerName}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setEditMatch(match)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-primary-400 hover:bg-primary-400/10 transition-colors"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(match)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {displayed.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <Swords size={40} className="mx-auto mb-3 opacity-20" />
              <p className="text-sm">No matches found.</p>
            </div>
          )}
        </div>
      )}

      {/* Gallery Placeholder */}
      {tab === 'gallery' && (
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-8 text-center">
          <Image size={48} className="text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Match Gallery</h3>
          <p className="text-sm text-gray-500 mb-4">Upload match photos and videos here. File storage integration required.</p>
          <Button variant="outline" leftIcon={<Image size={14} />}>Upload Media</Button>
        </div>
      )}

      {/* Modals */}
      <MatchFormModal isOpen={addOpen} onClose={() => setAddOpen(false)} onSave={handleSave} />
      <MatchFormModal isOpen={!!editMatch} onClose={() => setEditMatch(null)} match={editMatch ?? undefined} onSave={handleSave} />

      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Match"
        size="sm"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => { setMatches(p => p.filter(m => m.id !== deleteConfirm?.id)); setDeleteConfirm(null); }}>
              Delete
            </Button>
          </div>
        }
      >
        <p className="text-sm text-gray-300">Delete match vs <strong className="text-white">{deleteConfirm?.opponentName}</strong>?</p>
      </Modal>
    </div>
  );
};

export default MatchPage;
