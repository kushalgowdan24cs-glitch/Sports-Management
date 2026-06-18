import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Camera, Save, Lock, User, Phone, Mail, Building, Briefcase } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Avatar } from '@/components/common/Avatar';
import { Badge } from '@/components/common/Badge';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { SPORTS } from '@/utils/constants';
import clsx from 'clsx';

interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  sportsHandled: string[];
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const mockProfile = {
  name: 'Dr. Ramesh Kumar',
  email: 'ramesh.kumar@college.edu',
  phone: '9876543210',
  department: 'Physical Education',
  designation: 'Head Coach',
  sportsHandled: ['Cricket', 'Football', 'Kabaddi'],
  photoUrl: undefined,
  createdAt: '2024-06-01',
};

const ProfilePage: React.FC = () => {
  const [tab, setTab] = useState<'profile' | 'password'>('profile');
  const [saving, setSaving] = useState(false);
  const [selectedSports, setSelectedSports] = useState<string[]>(mockProfile.sportsHandled);

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
    defaultValues: {
      name: mockProfile.name,
      email: mockProfile.email,
      phone: mockProfile.phone,
      department: mockProfile.department,
      designation: mockProfile.designation,
    },
  });

  const { register: regPass, handleSubmit: handlePassSubmit, watch, formState: { errors: passErrors }, reset: resetPass } =
    useForm<PasswordFormData>();

  const newPass = watch('newPassword');

  const toggleSport = (sport: string) => {
    setSelectedSports(prev =>
      prev.includes(sport) ? prev.filter(s => s !== sport) : [...prev, sport],
    );
  };

  const onSaveProfile = async (data: ProfileFormData) => {
    setSaving(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1000));
    setSaving(false);
    console.log('Profile saved:', { ...data, sportsHandled: selectedSports });
  };

  const onChangePassword = async (data: PasswordFormData) => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setSaving(false);
    resetPass();
    console.log('Password changed:', data);
  };

  return (
    <div className="max-w-4xl">
      <PageHeader
        title="My Profile"
        subtitle="Manage your coach profile and account settings"
        icon={<User size={22} />}
        breadcrumb={[{ label: 'Admin' }, { label: 'Profile' }]}
      />

      {/* Profile Card */}
      <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            <Avatar name={mockProfile.name} src={mockProfile.photoUrl} size="xl" />
            <button className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-primary-600 hover:bg-primary-500 border-2 border-dark-800 transition-colors">
              <Camera size={12} className="text-white" />
            </button>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{mockProfile.name}</h2>
            <p className="text-sm text-gray-400">{mockProfile.designation} · {mockProfile.department}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="primary">Admin</Badge>
              <Badge variant="success">Active</Badge>
              {mockProfile.sportsHandled.map(s => (
                <Badge key={s} variant="gray">{s}</Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-dark-800 border border-dark-700 rounded-xl p-1 w-fit">
        {[
          { key: 'profile',  label: 'Edit Profile',     icon: User },
          { key: 'password', label: 'Change Password',  icon: Lock },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as 'profile' | 'password')}
            className={clsx(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
              tab === t.key
                ? 'bg-primary-600/30 text-primary-300 border border-primary-500/30'
                : 'text-gray-400 hover:text-white',
            )}
          >
            <t.icon size={14} />
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'profile' && (
        <form onSubmit={handleSubmit(onSaveProfile)}>
          <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
            <h3 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
              <User size={16} className="text-primary-400" /> Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <Input
                label="Full Name"
                leftIcon={<User size={14} />}
                required
                {...register('name', { required: 'Name is required' })}
                error={errors.name?.message}
              />
              <Input
                label="Email"
                type="email"
                leftIcon={<Mail size={14} />}
                required
                {...register('email', { required: 'Email is required' })}
                error={errors.email?.message}
              />
              <Input
                label="Phone Number"
                type="tel"
                leftIcon={<Phone size={14} />}
                {...register('phone')}
              />
              <Input
                label="Department"
                leftIcon={<Building size={14} />}
                required
                {...register('department', { required: 'Department is required' })}
                error={errors.department?.message}
              />
              <Input
                label="Designation"
                leftIcon={<Briefcase size={14} />}
                {...register('designation')}
                wrapperClassName="sm:col-span-2"
              />
            </div>

            {/* Sports Handled */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Briefcase size={14} className="text-primary-400" /> Sports Handled
              </h3>
              <div className="flex flex-wrap gap-2">
                {SPORTS.map(sport => (
                  <button
                    key={sport}
                    type="button"
                    onClick={() => toggleSport(sport)}
                    className={clsx(
                      'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                      selectedSports.includes(sport)
                        ? 'bg-primary-600/20 border-primary-500/50 text-primary-300'
                        : 'bg-dark-900 border-dark-700 text-gray-400 hover:border-dark-600 hover:text-white',
                    )}
                  >
                    {sport}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button type="submit" isLoading={saving} leftIcon={<Save size={14} />}>
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      )}

      {tab === 'password' && (
        <form onSubmit={handlePassSubmit(onChangePassword)}>
          <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
            <h3 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
              <Lock size={16} className="text-primary-400" /> Change Password
            </h3>
            <div className="space-y-4 max-w-sm">
              <Input
                label="Current Password"
                type="password"
                leftIcon={<Lock size={14} />}
                required
                {...regPass('currentPassword', { required: 'Current password is required' })}
                error={passErrors.currentPassword?.message}
              />
              <Input
                label="New Password"
                type="password"
                leftIcon={<Lock size={14} />}
                required
                {...regPass('newPassword', {
                  required: 'New password is required',
                  minLength: { value: 8, message: 'Password must be at least 8 characters' },
                })}
                error={passErrors.newPassword?.message}
                hint="At least 8 characters"
              />
              <Input
                label="Confirm New Password"
                type="password"
                leftIcon={<Lock size={14} />}
                required
                {...regPass('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: val => val === newPass || 'Passwords do not match',
                })}
                error={passErrors.confirmPassword?.message}
              />
            </div>
            <div className="flex justify-end mt-6">
              <Button type="submit" isLoading={saving} leftIcon={<Lock size={14} />}>
                Update Password
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProfilePage;
