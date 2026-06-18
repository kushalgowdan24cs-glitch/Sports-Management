import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/store';
import { logout, loginStart, loginSuccess, loginFailure } from '@/store/slices/authSlice';
import { authService } from '@/services/authService';
import type { LoginRequest } from '@/types/auth.types';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  const login = async (credentials: LoginRequest) => {
    dispatch(loginStart());
    try {
      const response = await authService.login(credentials);
      dispatch(loginSuccess({
        user: response.data.user,
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      }));
      return { success: true };
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { message?: string } } })
        ?.response?.data?.message ?? 'Login failed. Please try again.';
      dispatch(loginFailure(message));
      return { success: false, error: message };
    }
  };

  const handleLogout = async () => {
    try { await authService.logout(); } catch { /* ignore */ }
    dispatch(logout());
  };

  return {
    user: auth.user,
    accessToken: auth.accessToken,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    error: auth.error,
    role: auth.user?.role,
    login,
    logout: handleLogout,
  };
};
