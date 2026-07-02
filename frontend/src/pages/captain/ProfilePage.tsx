import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import {
  User, Mail, Phone, BookOpen, Calendar, Shield,
  Trophy, Edit2, Save, X, Lock, Eye, EyeOff, Award, Star,
} from 'lucide-react';
import type { RootState } from '@/store';
import { Avatar } from '@/components/common/Avatar';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';

const MOCK_CAPTAIN_PROFILE = {
  usn: '1RN21CS088',
  department: 'Computer Science',
  year: '4th Year',
  sport: 'Kabaddi',
  team: 'RNS Kabaddi Team',
  playingRole: 'All-Rounder',
  bloodGroup: 'O+',
  height: '181 cm',
  weight: '75 kg',
  captainSince: '2025-07-01',
  jerseyNumber: 7,
  bio: 'Dedicated captain and all-rounder passionate about leading the team to victory through discipline and teamwork.',
};

interface EditableFields { phone: string; bloodGroup: string; height: string; weight: string; bio: string; }
interface PasswordFields { currentPassword: string; newPassword: string; confirmPassword: string; }

const InfoRow: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 p-3 rounded-xl bg-dark-900/50 border border-dark-700/50">
    <div className="mt-0.5 text-gray-400 shrink-0">{icon}</div>
    <div>
      <p className="text-[10px] text-gray-500 uppercase tracking-wider">{label}</p>
      <p className="text-sm font-medium text-white mt-0.5">{value}</p>
    </div>
  </div>
);

const ProfilePage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);

  const { register, handleSubmit, reset } = useForm<EditableFields>({
    defaultValues: {
      phone: user?.phone ?? '9876543210',
      bloodGroup: MOCK_CAPTAIN_PROFILE.bloodGroup,
      height: MOCK_CAPTAIN_PROFILE.height,
      weight: MOCK_CAPTAIN_PROFILE.weight,
      bio: MOCK_CAPTAIN_PROFILE.bio,
    },
  });

  const pwForm = useForm<PasswordFields>();

  const onSaveProfile = async (data: EditableFields) => {
    await new Promise(r => setTimeout(r, 500));
    console.log('Captain profile updated:', data);
    setIsEditing(false);
  };

  const onChangePassword = async (data: PasswordFields) => {
    await new Promise(r => setTimeout(r, 500));
    console.log('Password change:', data);
    pwForm.reset();
    setPwSuccess(true);
    setTimeout(() => setPwSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">My Profile</h1>
        <p className="text-sm text-gray-400 mt-1">View and manage your Captain profile</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Avatar + quick stats */}
        <div className="lg:col-span-1 space-y-5">
          <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 flex flex-col items-center text-center">
            <div className="relative mb-4">
              <Avatar name={user?.name ?? 'C'} size="xl" className="w-24 h-24 text-2xl" />
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-emerald-600 border-2 border-dark-800 flex items-center justify-center">
                <span className="text-[10px] font-bold text-white">#{MOCK_CAPTAIN_PROFILE.jerseyNumber}</span>
              </div>
            </div>
            <h2 className="text-lg font-bold text-white">{user?.name ?? 'Captain'}</h2>
            <p className="text-sm text-emerald-400 font-medium">{MOCK_CAPTAIN_PROFILE.playingRole}</p>
            <p className="text-xs text-gray-500 mt-1">{MOCK_CAPTAIN_PROFILE.team}</p>
            <div className="mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/25">
              <Trophy size={11} className="text-emerald-400" />
              <span className="text-xs font-semibold text-emerald-300">Team Captain</span>
            </div>

            <div className="w-full mt-4 pt-4 border-t border-dark-700 grid grid-cols-3 gap-2 text-center">
              {[
                { label: 'Sport',  val: MOCK_CAPTAIN_PROFILE.sport.slice(0, 7) },
                { label: 'Jersey', val: `#${MOCK_CAPTAIN_PROFILE.jerseyNumber}` },
                { label: 'Year',   val: '4th' },
              ].map(item => (
                <div key={item.label}>
                  <p className="text-sm font-bold text-white">{item.val}</p>
                  <p className="text-[10px] text-gray-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Permissions */}
          <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Shield size={14} className="text-emerald-400" /> Captain Permissions
            </h3>
            <div className="space-y-1.5">
              {[
                { label: 'Mark Team Attendance',     ok: true  },
                { label: 'Edit Attendance (same day)', ok: true },
                { label: 'Update Performance Scores', ok: true },
                { label: 'View Team Analytics',      ok: true  },
                { label: 'Create Announcements',     ok: true  },
                { label: 'Send Player Feedback',     ok: true  },
                { label: 'View Team Players',        ok: true  },
                { label: 'Admin Dashboard',          ok: false },
                { label: 'Create / Delete Players',  ok: false },
                { label: 'Assign Roles',             ok: false },
                { label: 'Manage System Settings',   ok: false },
              ].map(p => (
                <div key={p.label} className="flex items-center gap-2 text-xs">
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[9px] font-bold
                    ${p.ok ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                    {p.ok ? '✓' : '✕'}
                  </span>
                  <span className={p.ok ? 'text-gray-300' : 'text-gray-500'}>{p.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Badges */}
          <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-3">
              <Award size={14} className="inline text-yellow-400 mr-2" />Badges
            </h3>
            <div className="flex flex-wrap gap-2">
              {['Team Captain', 'District Finalist', '3+ Years', 'State Level', 'Perfect Attendance'].map(b => (
                <span key={b} className="px-2.5 py-1 text-xs rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
                  🏅 {b}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Personal Info + Password */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold text-white">Personal Information</h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 transition-all"
                >
                  <Edit2 size={12} /> Edit
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button onClick={() => { setIsEditing(false); reset(); }} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded-lg bg-dark-700 transition-all">
                    <X size={12} /> Cancel
                  </button>
                  <button onClick={handleSubmit(onSaveProfile)} className="flex items-center gap-1.5 text-xs text-white px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition-all">
                    <Save size={12} /> Save
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <InfoRow icon={<User size={14} />}     label="Full Name"      value={user?.name ?? 'Captain'} />
              <InfoRow icon={<Shield size={14} />}   label="USN"            value={MOCK_CAPTAIN_PROFILE.usn} />
              <InfoRow icon={<Mail size={14} />}     label="Email"          value={user?.email ?? 'captain@college.edu'} />
              <InfoRow icon={<BookOpen size={14} />} label="Department"     value={MOCK_CAPTAIN_PROFILE.department} />
              <InfoRow icon={<Calendar size={14} />} label="Year"           value={MOCK_CAPTAIN_PROFILE.year} />
              <InfoRow icon={<Star size={14} />}     label="Captain Since"  value={MOCK_CAPTAIN_PROFILE.captainSince} />
              <InfoRow icon={<Trophy size={14} />}   label="Sport"          value={MOCK_CAPTAIN_PROFILE.sport} />
              <InfoRow icon={<User size={14} />}     label="Team"           value={MOCK_CAPTAIN_PROFILE.team} />
            </div>

            {isEditing ? (
              <form className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input label="Phone Number" id="cap-edit-phone"  {...register('phone')} />
                  <Input label="Blood Group"  id="cap-edit-blood"  {...register('bloodGroup')} />
                  <Input label="Height"       id="cap-edit-height" {...register('height')} />
                  <Input label="Weight"       id="cap-edit-weight" {...register('weight')} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Bio</label>
                  <textarea
                    {...register('bio')} rows={3}
                    className="w-full bg-dark-900 border border-dark-700 rounded-xl px-3 py-2 text-sm text-white
                               focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 resize-none"
                  />
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InfoRow icon={<Phone size={14} />} label="Phone"       value={user?.phone ?? '9876543210'} />
                <InfoRow icon={<User size={14} />}  label="Blood Group" value={MOCK_CAPTAIN_PROFILE.bloodGroup} />
                <InfoRow icon={<User size={14} />}  label="Height"      value={MOCK_CAPTAIN_PROFILE.height} />
                <InfoRow icon={<User size={14} />}  label="Weight"      value={MOCK_CAPTAIN_PROFILE.weight} />
                <div className="sm:col-span-2 p-3 rounded-xl bg-dark-900/50 border border-dark-700/50">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Bio</p>
                  <p className="text-sm text-gray-300 leading-relaxed">{MOCK_CAPTAIN_PROFILE.bio}</p>
                </div>
              </div>
            )}
          </div>

          {/* Change Password */}
          <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
              <Lock size={14} className="text-amber-400" /> Change Password
            </h3>
            {pwSuccess && (
              <div className="mb-4 px-4 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-sm text-emerald-400">
                ✓ Password changed successfully!
              </div>
            )}
            <form onSubmit={pwForm.handleSubmit(onChangePassword)} className="space-y-3">
              <Input
                label="Current Password" id="cap-current-password"
                type={showCurrentPw ? 'text' : 'password'}
                {...pwForm.register('currentPassword', { required: true })}
                rightIcon={
                  <button type="button" onClick={() => setShowCurrentPw(v => !v)} className="text-gray-400 hover:text-white">
                    {showCurrentPw ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                }
              />
              <Input
                label="New Password" id="cap-new-password"
                type={showNewPw ? 'text' : 'password'}
                {...pwForm.register('newPassword', { required: true, minLength: 6 })}
                rightIcon={
                  <button type="button" onClick={() => setShowNewPw(v => !v)} className="text-gray-400 hover:text-white">
                    {showNewPw ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                }
              />
              <Input label="Confirm New Password" id="cap-confirm-password" type="password" {...pwForm.register('confirmPassword', { required: true })} />
              <Button type="submit" size="sm">Update Password</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
