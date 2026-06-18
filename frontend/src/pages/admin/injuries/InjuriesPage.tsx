import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Activity, Plus, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Modal } from '@/components/common/Modal';
import { StatusBadge, Badge } from '@/components/common/Badge';
import { Avatar } from '@/components/common/Avatar';
import type { Injury, InjuryFormData } from '@/types/injury.types';
import { INJURY_TYPES } from '@/utils/constants';
import { formatDate } from '@/utils/dateUtils';
import clsx from 'clsx';

const MOCK_INJURIES: Injury[] = [
  { id: '1', playerId: 'p1', playerName: 'Suresh Kumar',  sport: 'Kabaddi',    injuryType: 'Hamstring Injury', injuryDate: '2026-06-01', recoveryStatus: 'RECOVERING', expectedReturnDate: '2026-06-28', notes: 'Under physiotherapy. Advised rest from practice.',     createdAt: '2026-06-02T10:00:00Z', updatedAt: '2026-06-10T10:00:00Z' },
  { id: '2', playerId: 'p2', playerName: 'Priya Singh',   sport: 'Football',   injuryType: 'Ankle Injury',     injuryDate: '2026-05-28', recoveryStatus: 'RECOVERING', expectedReturnDate: '2026-07-05', notes: 'Ligament sprain. Wearing compression support.',          createdAt: '2026-05-29T10:00:00Z', updatedAt: '2026-06-08T10:00:00Z' },
  { id: '3', playerId: 'p3', playerName: 'Meena Raj',     sport: 'Badminton',  injuryType: 'Shoulder Injury',  injuryDate: '2026-05-20', recoveryStatus: 'RECOVERED',  expectedReturnDate: '2026-06-15', notes: 'Fully recovered. Cleared for play.',                    createdAt: '2026-05-21T10:00:00Z', updatedAt: '2026-06-15T10:00:00Z' },
  { id: '4', playerId: 'p4', playerName: 'Rahul Verma',   sport: 'Cricket',    injuryType: 'Back Pain',        injuryDate: '2026-06-10', recoveryStatus: 'ACTIVE',     notes: 'Persistent lower back pain. MRI recommended.',          createdAt: '2026-06-11T10:00:00Z', updatedAt: '2026-06-14T10:00:00Z' },
];

const InjuryFormModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  injury?: Injury;
  onSave: (data: InjuryFormData) => void;
}> = ({ isOpen, onClose, injury, onSave }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<InjuryFormData>({
    defaultValues: injury ? {
      playerId: injury.playerId,
      injuryType: injury.injuryType,
      injuryDate: injury.injuryDate,
      recoveryStatus: injury.recoveryStatus,
      expectedReturnDate: injury.expectedReturnDate,
      notes: injury.notes,
      treatedBy: injury.treatedBy,
    } : { recoveryStatus: 'ACTIVE' },
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => { reset(); onClose(); }}
      title={injury ? 'Edit Injury Record' : 'Log New Injury'}
      size="lg"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => { reset(); onClose(); }}>Cancel</Button>
          <Button variant="danger" onClick={handleSubmit(onSave)}>
            {injury ? 'Save Changes' : 'Log Injury'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <Input
          label="Player ID"
          required
          placeholder="Player identifier"
          {...register('playerId', { required: 'Player is required' })}
          error={errors.playerId?.message}
        />
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Injury Type"
            required
            options={INJURY_TYPES.map(t => ({ value: t, label: t }))}
            placeholder="Select injury type"
            {...register('injuryType', { required: 'Injury type is required' })}
            error={errors.injuryType?.message}
          />
          <Input
            label="Injury Date"
            type="date"
            required
            {...register('injuryDate', { required: 'Date is required' })}
            error={errors.injuryDate?.message}
          />
          <Select
            label="Recovery Status"
            required
            options={[
              { value: 'ACTIVE',     label: 'Active (Injured)' },
              { value: 'RECOVERING', label: 'Recovering' },
              { value: 'RECOVERED',  label: 'Recovered' },
              { value: 'CRITICAL',   label: 'Critical' },
            ]}
            {...register('recoveryStatus')}
          />
          <Input
            label="Expected Return"
            type="date"
            {...register('expectedReturnDate')}
          />
        </div>
        <Input
          label="Treated By"
          placeholder="Doctor / Physiotherapist name"
          {...register('treatedBy')}
        />
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Notes</label>
          <textarea
            className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none"
            rows={3}
            placeholder="Additional notes about the injury..."
            {...register('notes')}
          />
        </div>
      </div>
    </Modal>
  );
};

const InjuriesPage: React.FC = () => {
  const [injuries, setInjuries] = useState<Injury[]>(MOCK_INJURIES);
  const [addOpen, setAddOpen] = useState(false);
  const [editInj, setEditInj] = useState<Injury | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Injury | null>(null);
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = injuries.filter(i => !statusFilter || i.recoveryStatus === statusFilter);

  const active     = injuries.filter(i => i.recoveryStatus === 'ACTIVE' || i.recoveryStatus === 'RECOVERING').length;
  const critical   = injuries.filter(i => i.recoveryStatus === 'CRITICAL').length;
  const recovered  = injuries.filter(i => i.recoveryStatus === 'RECOVERED').length;

  const handleSave = (data: InjuryFormData) => {
    if (editInj) {
      setInjuries(prev => prev.map(i => i.id === editInj.id ? { ...i, ...data, updatedAt: new Date().toISOString() } : i));
      setEditInj(null);
    } else {
      const ni: Injury = {
        id: Date.now().toString(),
        playerName: 'New Player',
        sport: 'TBD',
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setInjuries(prev => [ni, ...prev]);
      setAddOpen(false);
    }
  };

  const statusRowBg = (status: string) =>
    status === 'ACTIVE'     ? 'border-l-red-500' :
    status === 'CRITICAL'   ? 'border-l-red-700' :
    status === 'RECOVERING' ? 'border-l-amber-500' :
    'border-l-emerald-500';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Injury Tracking"
        subtitle="Monitor and manage player injuries"
        icon={<Activity size={22} />}
        iconBg="bg-red-500/20"
        breadcrumb={[{ label: 'Admin' }, { label: 'Injuries' }]}
        actions={
          <Button size="sm" variant="danger" leftIcon={<Plus size={14} />} onClick={() => setAddOpen(true)}>
            Log Injury
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Logged', value: injuries.length, color: 'text-white' },
          { label: 'Active / Recovering', value: active, color: 'text-amber-400' },
          { label: 'Critical', value: critical, color: 'text-red-400' },
          { label: 'Recovered', value: recovered, color: 'text-emerald-400' },
        ].map(s => (
          <div key={s.label} className="bg-dark-800 border border-dark-700 rounded-2xl p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-3">
        <Select
          options={[
            { value: 'ACTIVE',     label: 'Active' },
            { value: 'RECOVERING', label: 'Recovering' },
            { value: 'RECOVERED',  label: 'Recovered' },
            { value: 'CRITICAL',   label: 'Critical' },
          ]}
          placeholder="All Statuses"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        />
      </div>

      {/* Injury Table */}
      <div className="bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-dark-700">
          <h2 className="text-base font-semibold text-white">Injury Records</h2>
        </div>
        <div className="divide-y divide-dark-700/50">
          {filtered.map(injury => (
            <div
              key={injury.id}
              className={clsx(
                'flex items-start gap-4 p-5 hover:bg-white/[0.02] transition-colors border-l-2',
                statusRowBg(injury.recoveryStatus),
              )}
            >
              <Avatar name={injury.playerName} size="md" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <p className="font-semibold text-white">{injury.playerName}</p>
                  <Badge variant="gray">{injury.sport}</Badge>
                  <StatusBadge status={injury.recoveryStatus} />
                </div>
                <p className="text-sm text-red-300 font-medium">{injury.injuryType}</p>
                <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-400">
                  <span>Injured: {formatDate(injury.injuryDate)}</span>
                  {injury.expectedReturnDate && (
                    <span className="text-amber-400">Return: {formatDate(injury.expectedReturnDate)}</span>
                  )}
                  {injury.treatedBy && <span>Treated by: {injury.treatedBy}</span>}
                </div>
                {injury.notes && (
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{injury.notes}</p>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => setEditInj(injury)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-primary-400 hover:bg-primary-400/10 transition-colors"
                >
                  <Edit size={14} />
                </button>
                <button
                  onClick={() => setDeleteConfirm(injury)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <Activity size={40} className="mx-auto mb-3 opacity-20" />
              <p className="text-sm">No injuries recorded.</p>
            </div>
          )}
        </div>
      </div>

      <InjuryFormModal isOpen={addOpen}   onClose={() => setAddOpen(false)}  onSave={handleSave} />
      <InjuryFormModal isOpen={!!editInj} onClose={() => setEditInj(null)}   onSave={handleSave} injury={editInj ?? undefined} />

      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Injury Record"
        size="sm"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => { setInjuries(p => p.filter(i => i.id !== deleteConfirm?.id)); setDeleteConfirm(null); }}>
              Delete
            </Button>
          </div>
        }
      >
        <p className="text-sm text-gray-300">
          Delete injury record for <strong className="text-white">{deleteConfirm?.playerName}</strong>?
        </p>
      </Modal>
    </div>
  );
};

export default InjuriesPage;
