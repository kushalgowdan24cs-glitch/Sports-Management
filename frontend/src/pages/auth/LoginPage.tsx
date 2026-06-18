import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/store';
import { loginSuccess } from '@/store/slices/authSlice';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { ROUTES } from '@/utils/constants';
import type { LoginRequest } from '@/types/auth.types';

const LoginPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<LoginRequest>({
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginRequest) => {
    setLoading(true);
    setError('');
    try {
      // Simulate API call — replace with real authService.login(data)
      await new Promise(r => setTimeout(r, 800));

      // Mock success — in production dispatch loginSuccess from useAuth hook
      dispatch(loginSuccess({
        user: {
          id: 'coach-1',
          name: 'Dr. Ramesh Kumar',
          email: data.email,
          phone: '9876543210',
          department: 'Physical Education',
          designation: 'Head Coach',
          sportsHandled: ['Cricket', 'Football', 'Kabaddi'],
          role: 'COACH',
          isActive: true,
          collegeId: 'RV-PHYS-01',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      }));

      navigate(ROUTES.ADMIN.DASHBOARD);
    } catch {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-dark-800/80 backdrop-blur-xl border border-dark-700 rounded-3xl p-8 shadow-2xl">
      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-600 to-violet-600 flex items-center justify-center mb-4 shadow-glow-primary">
          <Shield size={28} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white">Sports Management</h1>
        <p className="text-sm text-gray-400 mt-1">Coach Dashboard Login</p>
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
          placeholder="coach@college.edu"
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
            <button
              type="button"
              className="text-xs text-primary-400 hover:text-primary-300 transition-colors"
            >
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
