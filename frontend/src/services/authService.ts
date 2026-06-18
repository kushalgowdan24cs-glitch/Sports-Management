import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '@/utils/constants';
import type { LoginRequest, LoginResponse, ChangePasswordRequest } from '@/types/auth.types';

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const { data } = await axiosClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return data;
  },

  logout: async (): Promise<void> => {
    await axiosClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  },

  refresh: async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
    const { data } = await axiosClient.post(API_ENDPOINTS.AUTH.REFRESH, { refreshToken });
    return data.data;
  },

  changePassword: async (payload: ChangePasswordRequest): Promise<void> => {
    await axiosClient.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, payload);
  },

  forgotPassword: async (email: string): Promise<void> => {
    await axiosClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  },
};
