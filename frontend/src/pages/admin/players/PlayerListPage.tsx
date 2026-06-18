import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Search, Filter, Trash2, Edit, Eye, Upload, X, ChevronDown } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable, Column } from '@/components/common/DataTable';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Modal } from '@/components/common/Modal';
import { Badge, RoleBadge } from '@/components/common/Badge';
import { Avatar } from '@/components/common/Avatar';
import { useDebounce } from '@/hooks/useDebounce';
import type { Player, PlayerFormData, PlayerRole, PlayerYear } from '@/types/player.types';
import { SPORTS, DEPARTMENTS, PLAYER_ROLES, YEARS } from '@/utils/constants';
import { formatDate } from '@/utils/dateUtils';
import clsx from 'clsx';

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const generateMockPlayers = (): Player[] => [
  { id: '1', userId: 'u1', teamId: 't1', teamName: 'Cricket A', fullName: 'Arjun Sharma', usn: '1RV21CS001', email: 'arjun@college.edu', phone: '9876543210', department: 'Computer Science', year: '3rd Year', sport: 'Cricket', role: 'Batsman', isCaptain: true, isViceCaptain: false, joinedDate: '2024-06-01', createdAt: '2024-06-01T10:00:00Z', updatedAt: '2024-06-01T10:00:00Z' },
  { id: '2', userId: 'u2', teamId: 't1', teamName: 'Cricket A', fullName: 'Rahul Verma', usn: '1RV21CS002', email: 'rahul@college.edu', phone: '9876543211', department: 'Electronics', year: '2nd Year', sport: 'Cricket', role: 'Bowler', isCaptain: false, isViceCaptain: true, joinedDate: '2024-06-01', createdAt: '2024-06-01T10:00:00Z', updatedAt: '2024-06-01T10:00:00Z' },
  { id: '3', userId: 'u3', teamId: 't2', teamName: 'Football B', fullName: 'Priya Singh', usn: '1RV21EC003', email: 'priya@college.edu', phone: '9876543212', department: 'Electronics', year: '4th Year', sport: 'Football', role: 'Striker', isCaptain: false, isViceCaptain: false, joinedDate: '2024-06-01', createdAt: '2024-06-01T10:00:00Z', updatedAt: '2024-06-01T10:00:00Z' },
  { id: '4', userId: 'u4', teamId: 't2', teamName: 'Football B', fullName: 'Kiran Patel', usn: '1RV21ME004', email: 'kiran@college.edu', phone: '9876543213', department: 'Mechanical', year: '3rd Year', sport: 'Football', role: 'Goalkeeper', isCaptain: true, isViceCaptain: false, joinedDate: '2024-06-01', createdAt: '2024-06-01T10:00:00Z', updatedAt: '2024-06-01T10:00:00Z' },
  { id: '5', userId: 'u5', teamId: 't3', teamName: 'Kabaddi A', fullName: 'Suresh Kumar', usn: '1RV22CS005', email: 'suresh@college.edu', phone: '9876543214', department: 'Computer Science', year: '2nd Year', sport: 'Kabaddi', role: 'Raider', isCaptain: false, isViceCaptain: false, joinedDate: '2024-06-01', createdAt: '2024-06-01T10:00:00Z', updatedAt: '2024-06-01T10:00:00Z' },
  { id: '6', userId: 'u6', teamId: 't3', teamName: 'Kabaddi A', fullName: 'Deepa Nair', usn: '1RV22CE006', email: 'deepa@college.edu', phone: '9876543215', department: 'Civil', year: '1st Year', sport: 'Kabaddi', role: 'Defender', isCaptain: false, isViceCaptain: true, joinedDate: '2024-06-01', createdAt: '2024-06-01T10:00:00Z', updatedAt: '2024-06-01T10:00:00Z' },
  { id: '7', userId: 'u7', teamId: 't4', teamName: 'Volleyball A', fullName: 'Amit Joshi', usn: '1RV21IT007', email: 'amit@college.edu', phone: '9876543216', department: 'Information Technology', year: '4th Year', sport: 'Volleyball', role: 'All-Rounder', isCaptain: true, isViceCaptain: false, joinedDate: '2024-06-01', createdAt: '2024-06-01T10:00:00Z', updatedAt: '2024-06-01T10:00:00Z' },
  { id: '8', userId: 'u8', teamId: 't5', teamName: 'Badminton A', fullName: 'Meena Raj', usn: '1RV22EC008', email: 'meena@college.edu', phone: '9876543217', department: 'Electronics', year: '2nd Year', sport: 'Badminton', role: 'All-Rounder', isCaptain: false, isViceCaptain: false, joinedDate: '2024-06-01', createdAt: '2024-06-01T10:00:00Z', updatedAt: '2024-06-01T10:00:00Z' },
];

const mockPlayers = generateMockPlayers();

// ─── Player Form Modal ─────────────────────────────────────────────────────────
const PlayerFormModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  player?: Player;
  onSave: (data: PlayerFormData) => void;
}> = ({ isOpen, onClose, player, onSave }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<PlayerFormData>({
    defaultValues: player ? {
      fullName: player.fullName,
      usn: player.usn,
      email: player.email,
      phone: player.phone,
      department: player.department,
      year: player.year,
      sport: player.sport,
      teamId: player.teamId,
      role: player.role,
      isCaptain: player.isCaptain,
      isViceCaptain: player.isViceCaptain,
    } : {
      isCaptain: false,
      isViceCaptain: false,
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={player ? 'Edit Player' : 'Add New Player'}
      size="2xl"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit(onSave)}>
            {player ? 'Save Changes' : 'Add Player'}
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          required
          {...register('fullName', { required: 'Name is required' })}
          error={errors.fullName?.message}
        />
        <Input
          label="USN"
          required
          placeholder="1RV21CS001"
          {...register('usn', { required: 'USN is required' })}
          error={errors.usn?.message}
        />
        <Input
          label="Email"
          type="email"
          required
          {...register('email', { required: 'Email is required' })}
          error={errors.email?.message}
        />
        <Input
          label="Phone Number"
          type="tel"
          {...register('phone')}
        />
        <Select
          label="Department"
          required
          options={DEPARTMENTS.map(d => ({ value: d, label: d }))}
          placeholder="Select department"
          {...register('department', { required: 'Department is required' })}
          error={errors.department?.message}
        />
        <Select
          label="Year"
          required
          options={YEARS.map(y => ({ value: y, label: y }))}
          placeholder="Select year"
          {...register('year', { required: 'Year is required' })}
          error={errors.year?.message}
        />
        <Select
          label="Sport"
          required
          options={SPORTS.map(s => ({ value: s, label: s }))}
          placeholder="Select sport"
          {...register('sport', { required: 'Sport is required' })}
          error={errors.sport?.message}
        />
        <Select
          label="Role"
          required
          options={PLAYER_ROLES.map(r => ({ value: r, label: r }))}
          placeholder="Select role"
          {...register('role', { required: 'Role is required' })}
          error={errors.role?.message}
        />
        <Input
          label="Team ID"
          placeholder="Team identifier"
          {...register('teamId')}
          wrapperClassName="sm:col-span-2"
        />
        <div className="sm:col-span-2 flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded accent-primary-500" {...register('isCaptain')} />
            <span className="text-sm text-gray-300">Captain</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded accent-primary-500" {...register('isViceCaptain')} />
            <span className="text-sm text-gray-300">Vice Captain</span>
          </label>
        </div>
        {/* Photo upload placeholder */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-1">Profile Photo</label>
          <div className="border border-dashed border-dark-600 rounded-xl p-4 text-center hover:border-primary-500/50 transition-colors cursor-pointer">
            <Upload size={20} className="text-gray-500 mx-auto mb-2" />
            <p className="text-xs text-gray-500">Click to upload or drag & drop</p>
            <p className="text-[10px] text-gray-600 mt-1">PNG, JPG up to 5MB</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

// ─── Player Detail Drawer ──────────────────────────────────────────────────────
const PlayerDetailDrawer: React.FC<{
  player: Player | null;
  onClose: () => void;
}> = ({ player, onClose }) => {
  if (!player) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md bg-dark-900 border-l border-dark-700 h-full overflow-y-auto animate-slide-in">
        <div className="flex items-center justify-between p-5 border-b border-dark-700">
          <h2 className="text-lg font-semibold text-white">Player Details</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="p-5">
          {/* Profile */}
          <div className="flex items-center gap-4 mb-6">
            <Avatar name={player.fullName} src={player.photoUrl} size="xl" />
            <div>
              <h3 className="text-xl font-bold text-white">{player.fullName}</h3>
              <p className="text-sm text-gray-400">{player.usn}</p>
              <div className="flex items-center gap-1.5 mt-2">
                {player.isCaptain && <Badge variant="success">Captain</Badge>}
                {player.isViceCaptain && <Badge variant="info">Vice Captain</Badge>}
                <RoleBadge role={player.role} />
              </div>
            </div>
          </div>
          {/* Details grid */}
          <div className="space-y-4">
            {[
              { label: 'Email',      value: player.email },
              { label: 'Phone',      value: player.phone },
              { label: 'Department', value: player.department },
              { label: 'Year',       value: player.year },
              { label: 'Sport',      value: player.sport },
              { label: 'Team',       value: player.teamName },
              { label: 'Joined',     value: formatDate(player.joinedDate) },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between py-2 border-b border-dark-700/50">
                <span className="text-sm text-gray-500">{label}</span>
                <span className="text-sm text-white font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const PlayerListPage: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>(mockPlayers);
  const [search, setSearch] = useState('');
  const [sportFilter, setSportFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(0);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editPlayer, setEditPlayer] = useState<Player | null>(null);
  const [viewPlayer, setViewPlayer] = useState<Player | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Player | null>(null);

  const debouncedSearch = useDebounce(search, 300);
  const PAGE_SIZE = 6;

  const filtered = players.filter(p => {
    const matchSearch = !debouncedSearch ||
      p.fullName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      p.usn.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      p.email.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchSport = !sportFilter || p.sport === sportFilter;
    const matchRole = !roleFilter || p.role === roleFilter;
    return matchSearch && matchSport && matchRole;
  });

  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const handleSave = useCallback((data: PlayerFormData) => {
    if (editPlayer) {
      setPlayers(prev => prev.map(p => p.id === editPlayer.id ? { ...p, ...data } : p));
      setEditPlayer(null);
    } else {
      const newPlayer: Player = {
        id: Date.now().toString(),
        userId: Date.now().toString(),
        ...data,
        teamName: 'TBD',
        joinedDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setPlayers(prev => [newPlayer, ...prev]);
      setAddModalOpen(false);
    }
  }, [editPlayer]);

  const handleDelete = useCallback((player: Player) => {
    setPlayers(prev => prev.filter(p => p.id !== player.id));
    setDeleteConfirm(null);
  }, []);

  const columns: Column<Player>[] = [
    {
      key: 'fullName',
      header: 'Player',
      render: (row: Player) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.fullName} src={row.photoUrl} size="sm" />
          <div>
            <p className="text-sm font-medium text-white">{row.fullName}</p>
            <p className="text-xs text-gray-500">{row.usn}</p>
          </div>
        </div>
      ),
    },
    { key: 'sport',      header: 'Sport',       render: (row: Player) => <span className="text-sm text-gray-200">{row.sport}</span> },
    { key: 'teamName',   header: 'Team',        render: (row: Player) => <span className="text-sm text-gray-400">{row.teamName}</span> },
    { key: 'role',       header: 'Role',        render: (row: Player) => <RoleBadge role={row.role} /> },
    { key: 'year',       header: 'Year',        render: (row: Player) => <span className="text-xs text-gray-400">{row.year}</span> },
    {
      key: 'status',
      header: 'Status',
      render: (row: Player) => (
        <div className="flex flex-col gap-1">
          {row.isCaptain && <Badge variant="success" size="sm">Captain</Badge>}
          {row.isViceCaptain && <Badge variant="info" size="sm">Vice Captain</Badge>}
          {!row.isCaptain && !row.isViceCaptain && <Badge variant="gray" size="sm">Player</Badge>}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Player Management"
        subtitle={`${filtered.length} players found`}
        icon={<Filter size={22} />}
        iconBg="bg-blue-500/20"
        breadcrumb={[{ label: 'Admin' }, { label: 'Players' }]}
        actions={
          <>
            <Button variant="outline" size="sm" leftIcon={<Upload size={14} />}>
              Bulk Import
            </Button>
            <Button size="sm" leftIcon={<Plus size={14} />} onClick={() => setAddModalOpen(true)}>
              Add Player
            </Button>
          </>
        }
      />

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <Input
          placeholder="Search by name, USN, or email..."
          leftIcon={<Search size={14} />}
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(0); }}
          wrapperClassName="flex-1"
        />
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<Filter size={14} />}
          onClick={() => setShowFilters(v => !v)}
          rightIcon={<ChevronDown size={12} className={clsx('transition-transform', showFilters && 'rotate-180')} />}
        >
          Filters {(sportFilter || roleFilter) && '(active)'}
        </Button>
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-3 mb-4 p-4 bg-dark-800 border border-dark-700 rounded-xl">
          <Select
            options={SPORTS.map(s => ({ value: s, label: s }))}
            placeholder="All Sports"
            value={sportFilter}
            onChange={e => { setSportFilter(e.target.value); setPage(0); }}
          />
          <Select
            options={PLAYER_ROLES.map(r => ({ value: r, label: r }))}
            placeholder="All Roles"
            value={roleFilter}
            onChange={e => { setRoleFilter(e.target.value); setPage(0); }}
          />
          {(sportFilter || roleFilter) && (
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<X size={12} />}
              onClick={() => { setSportFilter(''); setRoleFilter(''); }}
            >
              Clear filters
            </Button>
          )}
        </div>
      )}

      {/* Table */}
      <DataTable
        columns={columns}
        data={paginated}
        keyField="id"
        emptyMessage="No players found. Add your first player!"
        page={page}
        totalPages={totalPages}
        totalElements={filtered.length}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        onRowClick={setViewPlayer}
        actions={(player) => (
          <div className="flex items-center justify-end gap-1">
            <button
              onClick={() => setViewPlayer(player)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              title="View details"
            >
              <Eye size={14} />
            </button>
            <button
              onClick={() => setEditPlayer(player)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-primary-400 hover:bg-primary-400/10 transition-colors"
              title="Edit player"
            >
              <Edit size={14} />
            </button>
            <button
              onClick={() => setDeleteConfirm(player)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
              title="Delete player"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      />

      {/* Add Modal */}
      <PlayerFormModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSave={handleSave}
      />

      {/* Edit Modal */}
      <PlayerFormModal
        isOpen={!!editPlayer}
        onClose={() => setEditPlayer(null)}
        player={editPlayer ?? undefined}
        onSave={handleSave}
      />

      {/* Detail Drawer */}
      <PlayerDetailDrawer player={viewPlayer} onClose={() => setViewPlayer(null)} />

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Player"
        size="sm"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>
              Delete
            </Button>
          </div>
        }
      >
        <p className="text-sm text-gray-300">
          Are you sure you want to delete <strong className="text-white">{deleteConfirm?.fullName}</strong>?
          This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default PlayerListPage;
