import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, CoachProfile } from '@/types/auth.types';
import { saveTokens, clearTokens } from '@/utils/tokenUtils';

const initialState: AuthState = {
  user: null,
  accessToken: localStorage.getItem('sms_access_token'),
  refreshToken: localStorage.getItem('sms_refresh_token'),
  isAuthenticated: !!localStorage.getItem('sms_access_token'),
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<{ user: CoachProfile; accessToken: string; refreshToken: string }>) {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.error = null;
      saveTokens(action.payload.accessToken, action.payload.refreshToken);
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    },
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      clearTokens();
    },
    setUser(state, action: PayloadAction<CoachProfile>) {
      state.user = action.payload;
    },
    updateTokens(state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      saveTokens(action.payload.accessToken, action.payload.refreshToken);
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const {
  loginStart, loginSuccess, loginFailure,
  logout, setUser, updateTokens, clearError,
} = authSlice.actions;

export default authSlice.reducer;
