import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, ArrowRight, Zap } from 'lucide-react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/store';
import { loginSuccess } from '@/store/slices/authSlice';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { ROUTES } from '@/utils/constants';
import type { LoginRequest } from '@/types/auth.types';

// ─── Mock user profiles ──────────────────────────────────────────────────────
const MOCK_COACH = {
  id: 'coach-1',
  name: 'Dr. Ramesh Kumar',
  email: 'coach@college.edu',
  phone: '9876543210',
  department: 'Physical Education',
  designation: 'Head Coach',
  sportsHandled: ['Cricket', 'Football', 'Kabaddi'],
  role: 'COACH' as const,
  isActive: true,
  collegeId: 'RV-PHYS-01',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const MOCK_PLAYER = {
  id: 'player-1',
  name: 'Arjun Sharma',
  email: 'player@college.edu',
  phone: '9845123456',
  department: 'Computer Science',
  designation: 'Player',
  sportsHandled: ['Kabaddi'],
  role: 'PLAYER' as const,
  isActive: true,
  collegeId: 'RV-CS-101',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const LoginPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<LoginRequest>({
    defaultValues: { email: '', password: '' },
  });

  const doLogin = async (mockUser: typeof MOCK_COACH | typeof MOCK_PLAYER) => {
    setLoading(true);
    setError('');
    try {
      await new Promise(r => setTimeout(r, 600));
      dispatch(loginSuccess({
        user: mockUser,
        accessToken: `mock-access-token-${mockUser.role.toLowerCase()}`,
        refreshToken: `mock-refresh-token-${mockUser.role.toLowerCase()}`,
      }));
      navigate(mockUser.role === 'PLAYER' ? ROUTES.PLAYER.DASHBOARD : ROUTES.ADMIN.DASHBOARD);
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: LoginRequest) => {
    if (data.email === MOCK_PLAYER.email) {
      await doLogin(MOCK_PLAYER);
    } else {
      await doLogin(MOCK_COACH);
    }
  };

  const quickLogin = async (role: 'COACH' | 'PLAYER') => {
    const user = role === 'PLAYER' ? MOCK_PLAYER : MOCK_COACH;
    setValue('email', user.email);
    setValue('password', 'password123');
    await doLogin(user);
  };

  return (
    <div className="bg-dark-800/80 backdrop-blur-xl border border-dark-700 rounded-3xl p-8 shadow-2xl">
      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-600 to-violet-600 flex items-center justify-center mb-4 shadow-glow-primary">
          <Shield size={28} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white">Sports Management</h1>
        <p className="text-sm text-gray-400 mt-1">Sign in to your dashboard</p>
      </div>

      {/* Quick Login Presets */}
      <div className="mb-5">
        <p className="text-xs text-gray-500 text-center mb-2 flex items-center justify-center gap-1.5">
          <Zap size={11} className="text-amber-400" /> Quick Login Presets
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => quickLogin('COACH')}
            disabled={loading}
            className="flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl bg-primary-500/10 border border-primary-500/25
                       text-xs font-medium text-primary-300 hover:bg-primary-500/20 transition-all disabled:opacity-50"
          >
            <span className="text-base">🏅</span>
            <span>Coach / Admin</span>
          </button>
          <button
            type="button"
            onClick={() => quickLogin('PLAYER')}
            disabled={loading}
            className="flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25
                       text-xs font-medium text-emerald-300 hover:bg-emerald-500/20 transition-all disabled:opacity-50"
          >
            <span className="text-base">🏃</span>
            <span>Player</span>
          </button>
        </div>
      </div>

      <div className="relative flex items-center mb-5">
        <div className="flex-1 border-t border-dark-700" />
        <span className="px-3 text-xs text-gray-600">or sign in manually</span>
        <div className="flex-1 border-t border-dark-700" />
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="coach@college.edu or player@college.edu"
          required
          id="login-email"
          autoComplete="email"
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' },
          })}
          error={errors.email?.message}
        />

        <div>
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            required
            id="login-password"
            autoComplete="current-password"
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="text-gray-400 hover:text-white transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            }
            {...register('password', { required: 'Password is required' })}
            error={errors.password?.message}
          />
          <div className="flex justify-end mt-1">
            <button type="button" className="text-xs text-primary-400 hover:text-primary-300 transition-colors">
              Forgot password?
            </button>
          </div>
        </div>

        <Button
          type="submit"
          isLoading={loading}
          className="w-full"
          rightIcon={<ArrowRight size={14} />}
          size="lg"
        >
          Sign In
        </Button>
      </form>

      {/* Hint */}
      <p className="text-center text-xs text-gray-600 mt-6">
        Sports Management System · College Athletics Module
      </p>
    </div>
  );
};

export default LoginPage;
