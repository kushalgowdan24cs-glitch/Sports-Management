export type Role = 'COACH' | 'CAPTAIN' | 'VICE_CAPTAIN' | 'PLAYER';

export interface User {
  id: string;
  email: string;
  role: Role;
  isActive: boolean;
  collegeId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CoachProfile extends User {
  name: string;
  phone: string;
  department: string;
  designation: string;
  sportsHandled: string[];
  photoUrl?: string;
}

export interface AuthState {
  user: CoachProfile | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
    user: CoachProfile;
  };
  message: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
